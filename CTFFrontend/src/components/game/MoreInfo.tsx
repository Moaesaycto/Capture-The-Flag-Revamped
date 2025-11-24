import { MdVideogameAsset } from "react-icons/md";
import Container from "../main/Containers"
import { useGameContext } from "../contexts/GameContext";
import Color from "color";
import { FaCheck, FaFlag } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const MoreInfo = () => {
    const { teams } = useGameContext();


    return (
        <Container title="Game Details" Icon={MdVideogameAsset}>
            <div className="w-full flex flex-row gap-4 items-center bg-neutral-900 p-3 rounded">
                <span className="truncate">Team flag registrations:</span>
                <div className="flex-1 flex flex-row justify-end gap-4">
                    {teams.map((t, k) => {
                        return <div className="relative" key={k}>
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
                                    color: t.registered ? "#00C950" : "#FB2C36",
                                    borderColor: t.registered ? "#00C950" : "#FB2C36",
                                    backgroundColor: t.registered ? "#0b8418" : "#720003",

                                }}
                            >
                                {t.registered ? <FaCheck /> : <FaXmark />}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </Container>
    );
}

export default MoreInfo;