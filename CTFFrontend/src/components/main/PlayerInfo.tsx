import { FaFlag } from "react-icons/fa";
import { useAuthContext } from "@/components/contexts/AuthContext";
import Spinner from "./LoadingSpinner";

const PlayerInfo = () => {
    const { me, myTeam } = useAuthContext();
    return (
        (myTeam && me ?
            <div
                className="bg-neutral-800 flex items-center gap-3 mb-5"
            >
                <div className="text-5xl">
                    <FaFlag color={myTeam?.color} />
                </div>
                <div>
                    <span className="text-2xl flex gap-2 items-center" style={{ color: myTeam?.color }}>
                        {me?.name}
                    </span>
                    <div className="flex flex-row items-center gap-1">
                        You are playing for team
                        <p className="inline" style={{ color: myTeam?.color }}>{myTeam?.name}</p>
                    </div>
                </div>
            </div> :
            <div className="w-full flex items-center justify-center">
                <Spinner />
            </div>
        )
    )
}

export default PlayerInfo;