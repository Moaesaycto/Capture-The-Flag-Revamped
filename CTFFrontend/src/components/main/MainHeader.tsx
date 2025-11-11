import { PiChatsCircleBold, PiFlagBannerFoldDuotone, PiWifiHighBold, PiWifiXBold } from "react-icons/pi";
import Spinner from "./LoadingSpinner";
import { useGameContext } from "../contexts/GameContext";
import { useAuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";


const MainHeader = () => {
    const { loading, health } = useGameContext();
    const { loggedIn } = useAuthContext();

    const hasMessage = true;

    return (
        <header className="w-full bg-amber-400 text-4xl sm:text-5xl z-1" style={{ fontFamily: "American Captain" }}>
            <div className="flex justify-between items-center px-3 h-12">
                <div className="flex flex-row gap-2 py-0">
                    <PiFlagBannerFoldDuotone />
                    <h1 className="">
                        Capture The Flag
                    </h1>
                </div>
                <div className="h-8 flex items-center justify-center gap-1">
                    {loggedIn &&
                        <Link to="/message">
                            <div className="m-1 text-2xl border-3 rounded-xl relative p-0.5 hover:cursor-pointer">
                                {(hasMessage) && <div className="w-3 h-3 bg-red-500 border-red-900 rounded-full absolute -top-1.5 -left-1.5" />}
                                <PiChatsCircleBold />
                            </div>
                        </Link>}
                    {loading &&
                        <Spinner colorClass="text-black" thickness={4} />
                    }
                    {!loading && (health ?
                        <PiWifiHighBold className="h-full" /> :
                        <PiWifiXBold className="h-full" />
                    )}
                </div>
            </div>
            <div className="w-full h-2 construction-pattern" />
        </header>
    )
}

export default MainHeader;