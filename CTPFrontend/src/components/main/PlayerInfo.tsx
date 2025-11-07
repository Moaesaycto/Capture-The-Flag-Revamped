import { FaFlag } from "react-icons/fa";
import { useAuthContext } from "../contexts/AuthContext";
import Color from "color";
import { RxExit } from "react-icons/rx";
import { playerLeave } from "../../services/PlayerApi";

const PlayerInfo = () => {
    const { me, myTeam, jwt, logout } = useAuthContext();

    const onClick = () => {
        playerLeave(jwt);
        logout();
    }

    return (
        <div
            className="bg-neutral-800 p-2 rounded border-2"
            style={{
                color: myTeam?.color,
                borderColor: myTeam?.color,
                backgroundColor: Color(myTeam?.color).alpha(0.25).toString(),
            }}
        >
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col items-left">
                    <span className="text-2xl px-1">{me?.name}</span>
                    <div className="flex flex-row items-center gap-2 px-3">
                        <FaFlag color={myTeam?.color} />
                        <span className="text-white">You are playing for team </span>{myTeam?.name}
                    </div>
                </div>
                <button
                    className="h-full w-auto text-red-500 border-2 border-red-800 p-2 rounded flex 
                               hover:cursor-pointer items-center justify-center"
                    style={{ backgroundColor: Color("#9F0712").alpha(0.2).toString() }}
                    onClick={onClick}
                >
                    <RxExit className="h-8 w-8" />
                </button>
            </div>
        </div>
    )
}

export default PlayerInfo;