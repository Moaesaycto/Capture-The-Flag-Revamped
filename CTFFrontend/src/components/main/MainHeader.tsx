import { PiChatsCircleBold, PiFlagBannerFoldDuotone, PiGearBold, PiHouseBold } from "react-icons/pi";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useMessageContext } from "@/components/contexts/MessageContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useGameContext } from "../contexts/GameContext";
import { BannerWarning } from "./Messages";
import logo from "@/assets/title.svg";

const MainHeader = () => {
    const { me } = useAuthContext();
    const { dirtyTeams, dirtyGlobal } = useMessageContext();
    const { wantsNewMessageBadges } = useSettingsContext();
    const { emergency } = useGameContext();

    return (
        <header className="w-full flex flex-col items-center">
            <div className="bg-amber-400 w-full z-1 flex flex-col justify-center items-center">
                <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl w-full px-3 py-2 sm:py-3">
                    {/* Title and Flag */}
                    <div className="flex flex-row gap-2 sm:gap-3 items-center justify-center sm:justify-start w-full sm:w-auto">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center shrink-0">
                            <PiFlagBannerFoldDuotone className="w-full h-full" />
                        </div>
                        <img
                            alt="main-title"
                            src={logo}
                            className="h-8 sm:h-10 w-auto max-w-[200px] sm:max-w-none"
                        />
                    </div>

                    {/* Navigation Icons */}
                    {me && (
                        <div className="flex items-center justify-center mt-2 sm:mt-0">
                            <div className="flex flex-row items-center gap-1">
                                <Link to="/">
                                    <div className="text-2xl border-3 border-black rounded-xl p-1.5 hover:bg-amber-300 transition-colors">
                                        <PiHouseBold />
                                    </div>
                                </Link>
                                <Link to="/message">
                                    <div className="text-2xl border-3 border-black rounded-xl p-1.5 relative hover:bg-amber-300 transition-colors">
                                        {wantsNewMessageBadges && (dirtyTeams || dirtyGlobal) && (
                                            <div className="w-3 h-3 bg-red-500 border border-red-900 rounded-full absolute -top-1 -left-1" />
                                        )}
                                        <PiChatsCircleBold />
                                    </div>
                                </Link>
                                <Link to="/settings">
                                    <div className="text-2xl border-3 border-black rounded-xl p-1.5 hover:bg-amber-300 transition-colors">
                                        <PiGearBold />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full h-2 construction-pattern" />
            </div>
            <div className="w-full max-w-6xl px-3">
                {emergency && <BannerWarning message="An emergency has been declared. Check the global chat often for updates." />}
            </div>
        </header>
    );
};

export default MainHeader;