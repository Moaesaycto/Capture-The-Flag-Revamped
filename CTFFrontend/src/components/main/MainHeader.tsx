import { PiChatsCircleBold, PiFlagBannerFoldDuotone, PiGearBold, PiHouseBold } from "react-icons/pi";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useMessageContext } from "@/components/contexts/MessageContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useGameContext } from "../contexts/GameContext";
import { WarningMessage } from "./Messages";

const MainHeader = () => {
    const { loggedIn } = useAuthContext();
    const { dirtyTeams, dirtyGlobal } = useMessageContext();
    const { wantsNewMessageBadges } = useSettingsContext();
    const { emergency } = useGameContext();

    return (
        <header
            className="w-full flex flex-col items-center"
        >
            <div className="bg-amber-400 w-full z-1 text-5xl flex flex-col items-center justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-center px-3 max-w-6xl w-full">
                    <div
                        className="flex flex-row gap-2 py-0 items-center"
                        style={{
                            fontSize: "clamp(2.3rem, 7.45vw, 2.75rem)",
                        }}
                    >
                        <PiFlagBannerFoldDuotone />
                        <h1
                            style={{
                                fontFamily: "American Captain",
                            }}
                        >
                            Capture The Flag
                        </h1>
                    </div>
                    <div className="h-full flex items-center justify-center gap-1">
                        {loggedIn &&
                            <div className="flex flex-row items-center">
                                <Link to="/">
                                    <div className="m-1 text-2xl border-3 border-black rounded-xl relative p-0.5 hover:cursor-pointer">
                                        <PiHouseBold />
                                    </div>
                                </Link>
                                <Link to="/message">
                                    <div className="m-1 text-2xl border-3 border-black rounded-xl relative p-0.5 hover:cursor-pointer">
                                        {wantsNewMessageBadges && (dirtyTeams || dirtyGlobal) && <div className="w-3 h-3 bg-red-500 border-red-900 rounded-full absolute -top-1.5 -left-1.5" />}
                                        <PiChatsCircleBold />
                                    </div>
                                </Link>
                                <Link to="/settings">
                                    <div className="m-1 text-2xl border-3 border-black rounded-xl relative p-0.5 hover:cursor-pointer">
                                        <PiGearBold />
                                    </div>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
                <div className="w-full h-2 construction-pattern" />
            </div>
            <div className="w-full max-w-6xl">
                {emergency && <WarningMessage message="An emergency has been declared. Check the global chat often for updates." />}
            </div>
        </header>
    )
}

export default MainHeader;