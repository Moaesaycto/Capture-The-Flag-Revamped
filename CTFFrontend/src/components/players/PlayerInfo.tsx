import { useAuthContext } from "@/components/contexts/AuthContext";
import Spinner from "../main/LoadingSpinner";
import { useCallback } from "react";
import { playerLeave } from "@/services/PlayerApi";
import { useGameContext } from "../contexts/GameContext";
import { RxExit } from "react-icons/rx";
import Color from "color";

const PlayerInfo = () => {
    const { me, myTeam, logout, jwt } = useAuthContext();
    const { removeMeFromGame } = useGameContext();

    const onClick = useCallback(() => {
        removeMeFromGame();
        playerLeave(jwt);
        logout();
    }, [jwt, logout, removeMeFromGame]);

    return (
        (myTeam && me ?
            <div
                className="bg-neutral-900 p-2 sm:p-3 rounded flex items-center gap-2 sm:gap-3 mb-5 pr-3 sm:pr-5"
            >
                <div className="flex-1 min-w-0">
                    <span
                        className="block text-lg sm:text-2xl font-medium leading-tight
                            truncate"
                        style={{ color: myTeam?.color }}
                        title={me?.name}
                    >
                        {me?.name}
                    </span>

                    <p className="mt-1 text-sm leading-snug text-neutral-300 truncate">
                        You are on team{" "}
                        <span
                            className="font-semibold"
                            style={{ color: myTeam?.color }}
                            title={myTeam?.name}
                        >
                            {myTeam?.name}
                        </span>
                    </p>
                </div>
                <button
                    aria-label="Leave game"
                    onClick={onClick}
                    className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center
                              text-red-500 border-2 border-red-800 rounded p-2
                                hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1"
                    style={{
                        backgroundColor: Color("#9F0712").alpha(0.20).toString()
                    }}
                >
                    <RxExit />
                </button>
            </div>
            :
            <div className="w-full flex items-center justify-center">
                <Spinner />
            </div>
        )
    )
}

export default PlayerInfo;