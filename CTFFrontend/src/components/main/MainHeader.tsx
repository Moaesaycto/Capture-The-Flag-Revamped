import { PiChatsCircleBold, PiFlagBannerFoldDuotone, PiGearBold, PiHouseBold } from "react-icons/pi";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useMessageContext } from "@/components/contexts/MessageContext";
import { useLocation } from "react-router-dom";
import { useSettingsContext } from "../contexts/SettingsContext";

const MainHeader = () => {
    const { loggedIn } = useAuthContext();
    const { dirtyTeams, dirtyGlobal } = useMessageContext();
    const { wantsNewMessageBadges } = useSettingsContext();
    const location = useLocation().pathname.replace("/", "");

    return (
        <header
            className="w-full bg-amber-400 text-4xl sm:text-5xl z-1 flex flex-col items-center justify-center"
        >
            <div className="flex justify-between items-center px-3 h-12 max-w-6xl w-full">
                <div className="flex flex-row gap-2 py-0">
                    <PiFlagBannerFoldDuotone />
                    <h1
                        style={{ fontFamily: "American Captain" }}
                    >
                        Capture The Flag
                    </h1>
                </div>
                <div className="h-full flex items-center justify-center gap-1">
                    {loggedIn &&
                        <div className="flex flex-row items-center">
                            {location !== "" && <Link to="/">
                                <div className="m-1 text-2xl border-3 border-black rounded-xl relative p-0.5 hover:cursor-pointer">
                                    <PiHouseBold />
                                </div>
                            </Link>}
                            {location !== "message" && <Link to="/message">
                                <div className="m-1 text-2xl border-3 border-black rounded-xl relative p-0.5 hover:cursor-pointer">
                                    {wantsNewMessageBadges && (dirtyTeams || dirtyGlobal) && <div className="w-3 h-3 bg-red-500 border-red-900 rounded-full absolute -top-1.5 -left-1.5" />}
                                    <PiChatsCircleBold />
                                </div>
                            </Link>}
                            {location !== "settings" && <Link to="/settings">
                                <div className="m-1 text-2xl border-3 border-black rounded-xl relative p-0.5 hover:cursor-pointer">
                                    <PiGearBold />
                                </div>
                            </Link>}
                        </div>
                    }
                </div>
            </div>
            <div className="w-full h-2 construction-pattern" />
        </header>
    )
}

export default MainHeader;