import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiHealth } from "../../services/api";
import type { Player } from "../../types";
import { playerMe } from "../../services/PlayerApi";

interface AuthContextValue {
    jwt: string | null,
    setJwt: (jwt: string | null) => void;
    logout: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    healthy: boolean | null;
    setHealthy: (healthy: boolean | null) => void;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    hydrate: (token: string) => void;
    me: Player | null;
    setMe: (p: Player | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [healthy, setHealthy] = useState<boolean | null>(null);
    const [jwt, setJwt] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [me, setMe] = useState<Player | null>(null);

    const hydrate = (token: string) => {
        setJwt(token);
        setLoading(true);
    }

    useEffect(() => {
        if (!jwt) return;

        playerMe(jwt)
            .then(p => setMe(p))
            .catch(() => {
                setLoggedIn(false);
                setJwt(null);
            })
            .finally(() => {
                setLoading(false);
                setLoggedIn(true);
            });
    }, [jwt])

    useEffect(() => {
        apiHealth()
            .then(() => setHealthy(true))
            .catch(() => setHealthy(false))
            .finally(() => setLoading(false));
    }, []);


    const logout = useCallback(() => {
        setJwt(null);
        return;
    }, [jwt])

    return (
        <AuthContext.Provider value={{
            jwt,
            setJwt,
            logout,
            loading,
            setLoading,
            healthy,
            setHealthy,
            loggedIn,
            setLoggedIn,
            hydrate,
            setMe,
            me
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within an AuthProvider")
    return context;
}

export default AuthContext;