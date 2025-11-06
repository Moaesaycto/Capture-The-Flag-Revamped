import { PiFlagBannerFoldDuotone, PiWifiHighBold, PiWifiXBold } from "react-icons/pi";
import Spinner from "./LoadingSpinner";
import { useAuthContext } from "../contexts/AuthContext";

const MainHeader = () => {
    const { loading, healthy } = useAuthContext();

    return (
        <header className="w-full bg-amber-400 text-5xl z-1" style={{ fontFamily: "American Captain" }}>
            <div className="flex justify-between items-center px-3">
                <div className="flex flex-row gap-2 py-0">
                    <PiFlagBannerFoldDuotone />
                    <h1>
                        Capture The Flag
                    </h1>
                </div>
                <div className="h-8 w-8 flex items-center justify-center ">
                    {loading &&
                        <Spinner colorClass="text-black" thickness={4} />
                    }
                    {!loading && (healthy ?
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