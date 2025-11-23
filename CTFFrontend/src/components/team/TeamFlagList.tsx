import { FaFlag, FaXmark } from "react-icons/fa6";
import { useGameContext } from "../contexts/GameContext";
import Color from "color";
import { FaCheck } from "react-icons/fa";

const TeamFlagList = () => {
    const { teams } = useGameContext();

    return (
        <div className="w-full flex flex-row gap-4 items-center justify-center pb-10">
            {teams.map((t, k) => {
                return <div className="relative">
                    <div
                        className="w-10 h-10 text-xl flex items-center justify-center border-3 rounded"
                        key={k}
                        style={{
                            borderColor: t.color,
                            color: t.color,
                            backgroundColor: Color(t.color).alpha(0.2).toString(),
                            opacity: t.registered ? 1 : 0.5,
                        }}
                    >
                        <FaFlag />
                    </div>
                    <div
                        className="absolute -top-2 -left-2 border-2 rounded-full text-xs p-0.5"
                        style={{
                            color: t.registered ? "#00C950" : "#ff7579",
                            borderColor: t.registered ? "#00C950" : "#ff7579",
                            backgroundColor: t.registered ? "#0b8418" : "#720003",

                        }}
                    >
                        {t.registered ? <FaCheck /> : <FaXmark />}
                    </div>
                </div>
            })}
        </div>
    )
}

export default TeamFlagList;