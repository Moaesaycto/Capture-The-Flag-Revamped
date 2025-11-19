import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Settings {
    wantsNewMessageBadges: boolean;
}

interface SettingsContextValue extends Settings {
    setWantsNewMessageBadges: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const STORAGE_KEY = "userSettings";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        if (typeof window === "undefined") {
            return { wantsNewMessageBadges: true };
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored) as Settings;
        } catch (e) {
            console.warn("Failed to read settings from localStorage:", e);
        }

        return { wantsNewMessageBadges: true };
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn("Failed to write settings to localStorage:", e);
        }
    }, [settings]);

    return (
        <SettingsContext.Provider
            value={{
                wantsNewMessageBadges: settings.wantsNewMessageBadges,
                setWantsNewMessageBadges: (value: boolean) =>
                    setSettings(prev => ({ ...prev, wantsNewMessageBadges: value })),
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettingsContext must be used within a SettingsProvider");
    return context;
};
