import { PiChatsCircleBold, PiFlagBannerFoldDuotone, PiGearBold, PiHouseBold } from "react-icons/pi";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useMessageContext } from "@/components/contexts/MessageContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useGameContext } from "../contexts/GameContext";
import { BannerWarning } from "./Messages";

const MainHeader = () => {
    const { me } = useAuthContext();
    const { dirtyTeams, dirtyGlobal } = useMessageContext();
    const { wantsNewMessageBadges } = useSettingsContext();
    const { emergency } = useGameContext();

    return (
        <header
            className="w-full flex flex-col items-center"
        >
            <div className="bg-amber-400 w-full z-1 flex flex-col justify-center items-center min-h-16">
                <div className="flex flex-col sm:flex-row justify-between items-center px-3 max-w-6xl w-full flex-1">
                    <div className="flex flex-row gap-2 items-center">
                        <PiFlagBannerFoldDuotone
                            style={{
                                fontFamily: "American Captain",
                                fontSize: "clamp(2.3rem, 7.45vw, 2.75rem)",
                                lineHeight: 1,
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "American Captain",
                                fontSize: "clamp(2.3rem, 7.45vw, 2.75rem)",
                                lineHeight: 1,
                            }}
                        >
                            Capture The Flag
                        </span>
                    </div>
                    <div className="h-full flex items-center justify-center gap-1">
                        {me &&
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
                {emergency && <BannerWarning message="An emergency has been declared. Check the global chat often for updates." />}
            </div>
        </header>
    )
}

export default MainHeader;