import { useAuthContext } from "@/components/contexts/AuthContext";
import { useSettingsContext } from "@/components/contexts/SettingsContext";
import Page from "@/components/main/Page"
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaRegHandPointer, FaTrash } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";

type OptionType = "switch" | "button";

type OptionProps = {
    title: string,
    onChange: (value: boolean) => void;
    disabled?: boolean;
    type?: OptionType;
    icon?: IconType;
    color?: string;
    value?: boolean;
}

const Option = ({ title, onChange, disabled = false, type = "switch", icon: Icon, color, value }: OptionProps) => {
    let control;

    switch (type) {
        case "switch":
            control = (
                <label className="switch">
                    <input
                        type="checkbox"
                        disabled={disabled}
                        onChange={(e) => onChange(e.target.checked)}
                        checked={value}
                    />
                    <span className="slider round"></span>
                </label>
            );
            break;

        case "button":
            control = (
                <button
                    disabled={disabled}
                    className="px-3 py-1 bg-neutral-700 rounded hover:bg-neutral-600 hover:cursor-pointer hover:disabled:cursor-not-allowed"
                    style={{ color }}
                >
                    {Icon ? <Icon /> : <FaRegHandPointer />}
                </button>
            );
            break;

        default:
            control = null;
    }

    return (
        <div className="w-full flex flex-row justify-between items-center odd:bg-neutral-800 even:bg-neutral-900 p-2">
            <span className="text-md">{title}</span>
            {control}
        </div>
    );
};

type SettingsSectionProps = {
    icon: IconType,
    title: string,
    children?: ReactNode,
}

const SettingsSection = ({ icon: Icon, title, children }: SettingsSectionProps) => {
    return (
        <div className="bg-neutral-800 rounded-b mb-5 overflow-hidden">
            <div className="bg-amber-400 text-black flex gap-1 px-2 items-center rounded-t text-sm uppercase">
                <Icon /> <span>{title}</span>
            </div>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}

const SettingsPage = () => {
    const { me } = useAuthContext();
    const { wantsStatusNotifs,
        setWantsStatusNotifs,
        wantsGlobalMessageNotifs,
        setWantsGlobalMessageNotifs,
        wantsTeamMessageNotifs,
        setWantsTeamMessageNotifs,
        wantsAnnouncementNotifs,
        setWantsAnnouncementNotifs } = useSettingsContext();

    return (
        <Page>
            <h2
                className="text-4xl mb-4"
                style={{ fontFamily: "American Captain" }}
            >
                Settings
            </h2>
            <SettingsSection title="Notifications" icon={IoNotifications} >
                <Option title="Status updates" onChange={(e) => setWantsStatusNotifs(e)} value={wantsStatusNotifs} />
                <Option title="Global messages" onChange={(e) => setWantsGlobalMessageNotifs(e)} value={wantsGlobalMessageNotifs} />
                <Option title="Team messages" onChange={(e) => setWantsTeamMessageNotifs(e)} value={wantsTeamMessageNotifs} />
                <Option title="Announcements" disabled onChange={(e) => setWantsAnnouncementNotifs(e)} value={wantsAnnouncementNotifs} />
            </SettingsSection>
            {me && me.auth && <SettingsSection title="Moderator Options" icon={RiAdminFill} >
                <Option title="Full Reset Game" onChange={() => { }} type="button" icon={FaTrash} color="#ff7a7a" />
            </SettingsSection>}
        </Page>
    )
}

export default SettingsPage;