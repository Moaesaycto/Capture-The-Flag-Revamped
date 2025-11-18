import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Settings {
    wantsStatusNotifs: boolean;
    wantsGlobalMessageNotifs: boolean;
    wantsTeamMessageNotifs: boolean;
    wantsAnnouncementNotifs: boolean;
}

interface SettingsContextValue extends Settings {
    setWantsStatusNotifs: (value: boolean) => void;
    setWantsGlobalMessageNotifs: (value: boolean) => void;
    setWantsTeamMessageNotifs: (value: boolean) => void;
    setWantsAnnouncementNotifs: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const STORAGE_KEY = "userSettings";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        if (typeof window === "undefined") return {
            wantsStatusNotifs: true,
            wantsGlobalMessageNotifs: true,
            wantsTeamMessageNotifs: true,
            wantsAnnouncementNotifs: true,
        };

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored) as Settings;

        return {
            wantsStatusNotifs: true,
            wantsGlobalMessageNotifs: true,
            wantsTeamMessageNotifs: true,
            wantsAnnouncementNotifs: true,
        };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    return (
        <SettingsContext.Provider
            value={{
                wantsStatusNotifs: settings.wantsStatusNotifs,
                setWantsStatusNotifs: (value: boolean) =>
                    setSettings(prev => ({ ...prev, wantsStatusNotifs: value })),

                wantsGlobalMessageNotifs: settings.wantsGlobalMessageNotifs,
                setWantsGlobalMessageNotifs: (value: boolean) =>
                    setSettings(prev => ({ ...prev, wantsGlobalMessageNotifs: value })),

                wantsTeamMessageNotifs: settings.wantsTeamMessageNotifs,
                setWantsTeamMessageNotifs: (value: boolean) =>
                    setSettings(prev => ({ ...prev, wantsTeamMessageNotifs: value })),

                wantsAnnouncementNotifs: settings.wantsAnnouncementNotifs,
                setWantsAnnouncementNotifs: (value: boolean) =>
                    setSettings(prev => ({ ...prev, wantsAnnouncementNotifs: value })),
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
