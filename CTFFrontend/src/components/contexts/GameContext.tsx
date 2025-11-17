import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createWebSocket } from "../../services/api";
import type { Player, Team, State, GameState } from "../../types";
import { gameStatus } from "../../services/GameApi";
import { useAuthContext } from "./AuthContext";

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
    isRunning: boolean;
    isPaused: boolean;
    stateUpdateKey: number;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { me, logout } = useAuthContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [health, setHealth] = useState<boolean>(false);
    const [state, setState] = useState<State | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentDuration, setCurrentDuration] = useState<number>(0);
    const [stateUpdateKey, setStateUpdateKey] = useState<number>(0);

    useEffect(() => {
        createWebSocket(
            "state",
            undefined,
            () => { },
            () => {
                setLoading(false);
                setHealth(true);
            },
            () => {
                setLoading(false);
                setHealth(false);
            },
            () => {
                setLoading(false);
                setHealth(false);
            }
        );
    }, []);


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
            "state",
            undefined,
            (msg: string) => {
                const update: GameState = JSON.parse(msg);
                setState(update.state);
                setCurrentDuration(update.duration);
                setStateUpdateKey(prev => prev + 1);
            },
        )

        return () => {
            socket.close();
        }
    }, []);

    const getTeamFromId = useCallback((teamId: string) => {
        return teams.find(t => t.id === teamId) ?? null;
    }, [teams]);

    const removeMeFromGame = useCallback(() => {
        if (me) setPlayers(prev => prev.filter(p => p.id !== me.id));
    }, [me])

    useEffect(() => {
        gameStatus().then(r => {
            setLoading(false);
            setTeams(r.teams);
            setPlayers(r.players);
            setState(r.state.state as State);
            setCurrentDuration(r.state.duration);
        }).catch(() => { }); // TODO: fix
    }, []);

    const isRunning = useMemo<boolean>(() => {
        return state === "grace" || state === "scout" || state === "ffa";
    }, [state]);

    const isPaused = useMemo<boolean>(() => {
        return state === "paused";
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
            isRunning,
            isPaused,
            stateUpdateKey,
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