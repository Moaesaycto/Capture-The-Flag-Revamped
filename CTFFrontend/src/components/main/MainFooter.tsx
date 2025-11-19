import { BiCopyright } from "react-icons/bi";
import { useGameContext } from "../contexts/GameContext";
import Spinner from "./LoadingSpinner";
import { PiWarningBold, PiWifiHighBold, PiWifiXBold } from "react-icons/pi";

const MainFooter = () => {
    const { loading, health, emergencyChannelConnected } = useGameContext();
    return (
        <footer className="flex flex-col bg-amber-400 z-1 w-full items-center">
            <div className="construction-pattern h-2 w-full" />
            <div className="w-full text-center py-3 px-10 flex justify-between max-w-6xl">
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
                        (emergencyChannelConnected ? <PiWifiHighBold className="h-full" /> : <PiWarningBold />) :
                        <PiWifiXBold className="h-full" />
                    )}
                </div>
            </div>
        </footer>
    )
}

export default MainFooter;