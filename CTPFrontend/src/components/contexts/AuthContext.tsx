import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiHealth } from "../../services/api";

interface AuthContextValue {
    jwt: String | null,
    setJwt: (jwt: String | null) => void;
    logout: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    healthy: boolean | null;
    setHealthy: (loading: boolean | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [healthy, setHealthy] = useState<boolean | null>(null);

    useEffect(() => {
        apiHealth()
            .then(() => setHealthy(true))
            .catch(() => setHealthy(false))
            .finally(() => setLoading(false));
    }, []);

    const [jwt, setJwt] = useState<String | null>(null);

    const logout = useCallback(() => {
        setJwt(null);
        return;
    }, [jwt])

    return (
        <AuthContext.Provider value={{ jwt, setJwt, logout, loading, setLoading, healthy, setHealthy }}>
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