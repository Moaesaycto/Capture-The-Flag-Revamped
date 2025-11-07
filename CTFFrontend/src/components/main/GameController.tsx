import type { ComponentType } from "react";
import { FaArrowRotateLeft, FaLock } from "react-icons/fa6";
import { PiPlayFill, PiSkipBackFill, PiSkipForwardFill, PiStopFill } from "react-icons/pi";

type ControllButtonProps = {
    onClick: () => void;
    color?: string;
    Icon: ComponentType;
}

const ControllButton = ({ onClick, color, Icon }: ControllButtonProps) => {
    return (
        <button
            className="bg-neutral-900 hover:bg-neutral-700 hover:cursor-pointer p-2 rounded-lg"
            onClick={onClick}
            style={{
                color,
                fontSize: "20px"
            }}
        >
            <Icon />
        </button>
    )
}

const GameController = () => {
    return (
        <div>
            <div className="bg-amber-400 text-black flex gap-1 px-2 items-center rounded-t text-sm uppercase">
                <FaLock /> <span>Game Controls</span>
            </div>
            <div className="w-full pb-2 pt-3 bg-neutral-800 rounded-b mb-4 flex flex-row items-center justify-around">
                <ControllButton Icon={FaArrowRotateLeft} color="#ffb2b2" onClick={() => { }} />
                <ControllButton Icon={PiSkipBackFill} color="#a0c0ff" onClick={() => { }} />
                <ControllButton Icon={PiPlayFill} onClick={() => { }} />
                <ControllButton Icon={PiSkipForwardFill} color="#a0c0ff" onClick={() => { }} />
                <ControllButton Icon={PiStopFill} color="#ffb2b2" onClick={() => { }} />
            </div>
        </div>
    )
}

export default GameController;