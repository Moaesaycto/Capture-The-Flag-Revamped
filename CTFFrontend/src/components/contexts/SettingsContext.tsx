import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Settings {
    wantsNewMessageBadges: boolean;
    wantsMoreDetails: boolean;
    alwaysShowMap: boolean;
}

interface SettingsContextValue extends Settings {
    setWantsNewMessageBadges: (v: boolean) => void;
    setWantsMoreDetails: (v: boolean) => void;
    setAlwaysShowMap: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const STORAGE_KEY = "userSettings";

const DEFAULT = {
    wantsNewMessageBadges: true,
    wantsMoreDetails: false,
    alwaysShowMap: true,
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        if (typeof window === "undefined") {
            return DEFAULT;
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored) as Settings;
        } catch (e) {
            console.warn("Failed to read settings from localStorage:", e);
        }

        return DEFAULT;
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
                wantsMoreDetails: settings.wantsMoreDetails,
                setWantsMoreDetails: (value: boolean) =>
                    setSettings(prev => ({ ...prev, wantsMoreDetails: value })),
                alwaysShowMap: settings.alwaysShowMap,
                setAlwaysShowMap: (value: boolean) =>
                    setSettings(prev => ({ ...prev, alwaysShowMap: value })),
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
