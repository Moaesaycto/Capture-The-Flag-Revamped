import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createWebSocket } from "../../services/api";
import type { Player, Team } from "../../types";
import { gameStatus } from "../../services/GameApi";
import { useAuthContext } from "./AuthContext";

type State = "ready" | "grace" | "scout" | "ffa" | "ended" | "paused" | "loading"

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
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { me, logout } = useAuthContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [health, setHealth] = useState<boolean>(false);
    const [state, setState] = useState<State | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

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
        }).catch(() => { }); // TODO: fix
    }, []);

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