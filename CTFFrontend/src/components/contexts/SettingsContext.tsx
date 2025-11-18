import { createContext, useContext, useState, type ReactNode } from "react";

interface SettingsContextValue {
    wantsStatusNotifs: boolean;
    setWantsStatusNotifs: (value: boolean) => void;
    wantsGlobalMessageNotifs: boolean;
    setWantsGlobalMessageNotifs: (value: boolean) => void;
    wantsTeamMessageNotifs: boolean;
    setWantsTeamMessageNotifs: (value: boolean) => void;
    wantsAnnouncementNotifs: boolean;
    setWantsAnnouncementNotifs: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [wantsStatusNotifs, setWantsStatusNotifs] = useState<boolean>(true);
    const [wantsGlobalMessageNotifs, setWantsGlobalMessageNotifs] = useState<boolean>(true);
    const [wantsTeamMessageNotifs, setWantsTeamMessageNotifs] = useState<boolean>(true);
    const [wantsAnnouncementNotifs, setWantsAnnouncementNotifs] = useState<boolean>(true);

    return <SettingsContext.Provider
        value={{
            wantsStatusNotifs,
            setWantsStatusNotifs,
            wantsGlobalMessageNotifs,
            setWantsGlobalMessageNotifs,
            wantsTeamMessageNotifs,
            setWantsTeamMessageNotifs,
            wantsAnnouncementNotifs,
            setWantsAnnouncementNotifs,
        }}
    >
        {children}
    </SettingsContext.Provider>
}

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettingsContext must be used within a SettingsProvider");
}