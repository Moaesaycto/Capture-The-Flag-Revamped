import { BiCopyright } from "react-icons/bi";
import { useGameContext } from "../contexts/GameContext";
import Spinner from "./LoadingSpinner";
import { PiWifiHighBold, PiWifiXBold } from "react-icons/pi";

const MainFooter = () => {
    const { loading, health } = useGameContext();
    return (
        <div className="bg-amber-400 z-1">
            <div className="construction-pattern h-2" />
            <div className="w-full text-center py-3 px-10 flex justify-between">
                <span>
                    Rules
                </span>
                <div className="flex flex-row items-center gap-1">
                    <BiCopyright />
                    <a href="https://moae.dev/">
                        MOAE {new Date().getFullYear()}
                    </a>
                </div>
                <div className="text-2xl">
                    {loading &&
                        <Spinner colorClass="text-black" thickness={4} />
                    }
                    {!loading && (health ?
                        <PiWifiHighBold className="h-full" /> :
                        <PiWifiXBold className="h-full" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MainFooter;