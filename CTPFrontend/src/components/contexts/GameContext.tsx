import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createWebSocket } from "../../services/api";

type State = "WAITING_TO_START" | "GRACE_PERIOD" | "SCOUT_PERIOD" | "FFA_PERIOD" | "ENDED" | "PAUSED";

interface GameContextValue {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    state: State | null;
    setState: (state: State | null) => void;
    health: boolean;
    setHealth: (health: boolean) => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [health, setHealth] = useState<boolean>(false);
    const [state, setState] = useState<State | null>(null);

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

    return (
        <GameContext.Provider value={{
            loading,
            setLoading,
            state,
            setState,
            health,
            setHealth,

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