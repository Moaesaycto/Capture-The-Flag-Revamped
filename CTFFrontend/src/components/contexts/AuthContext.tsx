import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiHealth } from "@/services/api";
import type { Player, Team } from "@/types";
import { playerMe } from "@/services/PlayerApi";
import { teamGet } from "@/services/TeamApi";
import { useNavigate } from "react-router-dom";
import { usePushNotifications } from "@/services/usePushNotifications";

const JWT_KEY = import.meta.env.VITE_JWT_KEY;

interface AuthContextValue {
    jwt: string | null;
    setJwt: (jwt: string | null) => void;
    logout: () => void;
    authLoading: boolean;
    healthy: boolean | null;
    loggedIn: boolean;
    hydrate: (token: string) => void;
    me: Player | null;
    setMe: (p: Player | null) => void;
    myTeam: Team | null;
    setMyTeam: (t: Team | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();

    const { unsubscribe } = usePushNotifications();

    const [healthy, setHealthy] = useState<boolean | null>(null);
    const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem(JWT_KEY));
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const [authLoading, setAuthLoading] = useState<boolean>(!!jwt);

    const [me, setMe] = useState<Player | null>(null);
    const [myTeam, setMyTeam] = useState<Team | null>(null);

    const hydrate = (token: string) => {
        setJwt(token);
        setAuthLoading(true);
    };

    const logout = useCallback(() => {
        setJwt(null);
        setMe(null);
        setMyTeam(null);
        setLoggedIn(false);
        localStorage.removeItem(JWT_KEY);
        unsubscribe();
        navigate("/");
    }, []);

    useEffect(() => {
        if (jwt) localStorage.setItem(JWT_KEY, jwt);
        else localStorage.removeItem(JWT_KEY);
    }, [jwt]);

    useEffect(() => {
        if (!jwt) {
            setAuthLoading(false);
            setLoggedIn(false);
            setMe(null);
            setMyTeam(null);
            return;
        }

        let cancelled = false;
        setAuthLoading(true);

        playerMe(jwt)
            .then((p) => {
                if (cancelled) return;
                setMe(p);
                teamGet(p.team).then((t) => !cancelled && setMyTeam(t)).catch(() => { });
                setLoggedIn(true);
            })
            .catch(() => {
                if (cancelled) return;
                logout();
            })
            .finally(() => {
                if (cancelled) return;
                setAuthLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [jwt, logout]);

    useEffect(() => {
        apiHealth()
            .then(() => setHealthy(true))
            .catch(() => setHealthy(false));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                jwt,
                setJwt,
                logout,
                authLoading,
                healthy,
                loggedIn,
                hydrate,
                setMe,
                me,
                myTeam,
                setMyTeam,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
    return context;
};

export default AuthContext;
