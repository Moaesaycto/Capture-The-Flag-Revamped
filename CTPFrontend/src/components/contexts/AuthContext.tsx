import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface AuthContextValue {
    jwt: String | null,
    setJwt: (jwt: String | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [jwt, setJwt] = useState<String | null>(null);

    const logout = useCallback(() => {
        setJwt(null);
        return;
    }, [jwt])

    return (
        <AuthContext.Provider value={{ jwt, setJwt, logout }}>
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