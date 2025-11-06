import { PiFlagBannerFoldDuotone } from "react-icons/pi";
import { apiHealth } from "../../services/api";
import { useEffect, useState } from "react";
import Spinner from "./LoadingSpinner";
import { GiCheckMark } from "react-icons/gi";
import { FaCheck, FaCross, FaXmark } from "react-icons/fa6";

const MainHeader = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [healthy, setHealthy] = useState<boolean | null>(null);

    useEffect(() => {
        apiHealth()
            .then(() => setHealthy(false))
            .catch(() => setHealthy(false))
            .finally(() => setTimeout(() => setLoading(false), 1000));
    }, []);


    return (
        <header className="w-full bg-amber-400 text-5xl" style={{ fontFamily: "American Captain" }}>
            <div className="flex justify-between items-center px-3">
                <div className="flex flex-row gap-2 py-0">
                    <PiFlagBannerFoldDuotone />
                    <h1>
                        Capture The Flag
                    </h1>
                </div>
                <div className="border-4 border-solid rounded h-10 w-10 flex items-center justify-center">
                    {loading ? <Spinner colorClass="text-black" thickness={4} /> : (
                        healthy ? <FaCheck className="h-full" /> : <FaXmark className="h-full" />
                    )}
                </div>
            </div>
            <div className="w-full h-2 construction-pattern" />
        </header>
    )
}

export default MainHeader;