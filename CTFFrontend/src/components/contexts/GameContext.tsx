import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createWebSocket } from "../../services/api";
import type { Team } from "../../types";
import { gameStatus } from "../../services/GameApi";

type State = "ready" | "grace" | "scout" | "ffa" | "ended" | "paused" | "loading"

interface GameContextValue {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    state: State | null;
    setState: (state: State | null) => void;
    health: boolean;
    setHealth: (health: boolean) => void;
    teams: Team[],
    setTeams: (teams: Team[]) => void;
    getTeamFromId: (teamId: string) => Team | null;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [health, setHealth] = useState<boolean>(false);
    const [state, setState] = useState<State | null>(null);
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

    const getTeamFromId = useCallback((teamId: string) => {
        return teams.find(t => t.id === teamId) ?? null;
    }, [teams]);

    useEffect(() => {
        gameStatus().then(r => {
            setLoading(false);
            setTeams(r.teams);
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
            teams,
            setTeams,
            getTeamFromId,
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