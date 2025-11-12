import { PiChatsCircleBold, PiFlagBannerFoldDuotone, PiHouseBold } from "react-icons/pi";
import { useAuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useMessageContext } from "../contexts/MessageContext";


const MainHeader = () => {
    const { loggedIn } = useAuthContext();
    const {dirtyTeams, dirtyGlobal} = useMessageContext();

    return (
        <header className="w-full bg-amber-400 text-4xl sm:text-5xl z-1" style={{ fontFamily: "American Captain" }}>
            <div className="flex justify-between items-center px-3 h-12">
                <div className="flex flex-row gap-2 py-0">
                    <PiFlagBannerFoldDuotone />
                    <h1 className="">
                        Capture The Flag
                    </h1>
                </div>
                <div className="h-full flex items-center justify-center gap-1">
                    {loggedIn &&
                        <div className="flex flex-row items-center">
                            <Link to="/">
                                <div className="m-1 text-2xl border-3 rounded-xl relative p-0.5 hover:cursor-pointer">
                                    <PiHouseBold />
                                </div>
                            </Link>
                            <Link to="/message">
                                <div className="m-1 text-2xl border-3 rounded-xl relative p-0.5 hover:cursor-pointer">
                                    {(dirtyTeams || dirtyGlobal) && <div className="w-3 h-3 bg-red-500 border-red-900 rounded-full absolute -top-1.5 -left-1.5" />}
                                    <PiChatsCircleBold />
                                </div>
                            </Link>
                        </div>
                    }
                </div>
            </div>
            <div className="w-full h-2 construction-pattern" />
        </header>
    )
}

export default MainHeader;