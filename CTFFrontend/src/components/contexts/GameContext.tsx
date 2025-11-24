import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createWebSocket } from "@/services/api";
import type { Player, Team, State, GameState, Announcement } from "@/types";
import { gameStatus } from "@/services/GameApi";
import { useAuthContext } from "@/components/contexts/AuthContext";

interface GameContextValue {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    state: State | null;
    setState: (state: State | null) => void;
    health: boolean;
    setHealth: (health: boolean) => void;
    players: Player[],
    teams: Team[],
    getTeamFromId: (teamId: string) => Team | null;
    removeMeFromGame: () => void;
    currentDuration: number;
    isInGame: boolean;
    isPaused: boolean;
    stateUpdateKey: number;
    emergency: boolean;
    emergencyChannelConnected: boolean;
    announcements: Announcement[];
    frozen: boolean;
    winner: null | Team;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { me, logout, setMyTeam, myTeam, refreshTeam } = useAuthContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [health, setHealth] = useState<boolean>(false);
    const [state, setState] = useState<State | null>(null);
    const [prevState, setPrevState] = useState<State | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentDuration, setCurrentDuration] = useState<number>(0);
    const [stateUpdateKey, setStateUpdateKey] = useState<number>(0);
    const [paused, setPaused] = useState<boolean>(false);
    const [wsConnected, setWsConnected] = useState<boolean>(false);
    const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
    const [frozen, setFrozen] = useState<boolean>(false);

    const [emergency, setEmergency] = useState<boolean>(false);
    const [emergencyChannelConnected, setEmergencyChannelConnected] = useState<boolean>(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [winner, setWinner] = useState<null | Team>(null);

    useEffect(() => {
        if (prevState !== null && state !== prevState) {
            setFrozen(false);
        }

        setPrevState(state);

        if (state === "ready") {
            setTeams(prev =>
                prev.map(team => ({ ...team, registered: false }))
            );
            setMyTeam(prev => prev ? { ...prev, registered: false } : prev);
            setWinner(null);
        }

        if (state === "ffa" || state === "ended") {
            gameStatus().then(r => setTeams(r.teams));
            refreshTeam();
        }
    }, [state]);

    useEffect(() => {
        const socket = createWebSocket(
            "players",
            undefined,
            (msg: string) => {
                const newP = msg.startsWith("joined");
                const match = msg.match(/\{.*$/s);

                if (!match) return;
                const player: Player = JSON.parse(match[0])

                if (newP) {
                    setPlayers(prev => [...prev, player]);
                } else {
                    setPlayers(prev => prev.filter(p => p.id !== player.id));
                    if (player.id === me?.id) logout();
                }
            }
        );

        return () => {
            socket.close();
        };
    }, [logout, me]);

    useEffect(() => {
        const socket = createWebSocket(
            "announcements",
            undefined,
            (msg: string) => {
                const announcement: Announcement = JSON.parse(msg);
                switch (announcement.type) {
                    case "emergency":
                        setEmergency(true);
                        break;
                    case "reset":
                        window.location.reload();
                        break;
                    case "release":
                        setEmergency(false);
                        break;
                    case "custom":
                        setAnnouncements(prev => [...prev, announcement]);
                        break;
                    case "register":
                        setTeams(prev =>
                            prev.map(team =>
                                team.id === announcement.message
                                    ? { ...team, registered: true }
                                    : team
                            )
                        );
                        refreshTeam();
                        break;
                    case "frozen":
                        setFrozen(true);
                        break;
                    case "victory":
                        setWinner(getTeamFromId(announcement.message));
                }
            },
            () => setEmergencyChannelConnected(true),
            () => { },
            () => setEmergencyChannelConnected(false)
        );
        return () => socket.close();
    }, [myTeam])

    useEffect(() => {
        let socket: WebSocket | null = null;
        let retryTimeout: number | null = null;
        let hasRetried = false;
        let hasConnected = false;

        const handleSuccess = () => {
            hasConnected = true;
            setHealth(true);
            setWsConnected(true);
        };

        const handleFailure = () => {
            if (hasConnected) return;

            if (!hasRetried) {
                hasRetried = true;
                retryTimeout = window.setTimeout(() => {
                    connect();
                }, 1000);
            } else {
                setHealth(false);
                setWsConnected(true);
            }
        };

        const connect = () => {
            socket = createWebSocket(
                "state",
                undefined,
                (msg: string) => {
                    setFrozen(false);
                    if (!hasConnected) {
                        hasConnected = true;
                        setHealth(true);
                        setWsConnected(true);
                    }

                    const update: GameState = JSON.parse(msg);
                    setState(update.state);
                    setPaused(update.paused);
                    setCurrentDuration(update.duration);
                    setEmergency(false);
                    setStateUpdateKey(prev => prev + 1);

                    setEmergency(false);
                },
                handleSuccess,
                handleFailure,
                handleFailure
            );
        };

        connect();

        return () => {
            if (socket) socket.close();
            if (retryTimeout) clearTimeout(retryTimeout);
        };
    }, []);

    const getTeamFromId = useCallback((teamId: string) => {
        return teams.find(t => t.id === teamId) ?? null;
    }, [teams]);

    const removeMeFromGame = useCallback(() => {
        if (me) setPlayers(prev => prev.filter(p => p.id !== me.id));
    }, [me])

    useEffect(() => {
        gameStatus().then(r => {
            setTeams(r.teams);
            setPlayers(r.players);
            setState(r.state.state as State);
            setCurrentDuration(r.state.duration);
            setPaused(r.state.paused);
            setEmergency(r.state.emergency);
            setFrozen(r.state.frozen);
            setInitialDataLoaded(true);

            if (r.state.winner) {
                const winnerTeam = r.teams.find(t => t.id === r.state.winner) ?? null;
                setWinner(winnerTeam);
            } else {
                setWinner(null);
            }
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (wsConnected && initialDataLoaded) {
            setLoading(false);
        }
    }, [wsConnected, initialDataLoaded]);

    const isInGame = useMemo<boolean>(() => {
        return state === "grace" || state === "scout" || state === "ffa";
    }, [state]);

    return (
        <GameContext.Provider value={{
            loading,
            setLoading,
            state,
            setState,
            health,
            setHealth,
            players,
            teams,
            getTeamFromId,
            removeMeFromGame,
            currentDuration,
            isInGame,
            isPaused: paused,
            stateUpdateKey,
            emergency,
            emergencyChannelConnected,
            announcements,
            frozen,
            winner,
        }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGameContext must be used within a GameProvider")
    return context;
}

export default GameContext;