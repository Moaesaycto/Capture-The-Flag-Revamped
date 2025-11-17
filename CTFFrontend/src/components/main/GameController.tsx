import { useState, type ComponentType } from "react";
import { FaArrowRotateLeft, FaLock } from "react-icons/fa6";
import { PiPauseFill, PiPlayFill, PiSkipBackFill, PiSkipForwardFill, PiStopFill } from "react-icons/pi";
import type { StandardStatus } from "../../types";
import { gameEnd, gamePause, gameResume, gameRewind, gameSkip, gameStart } from "../../services/GameApi";
import { useAuthContext } from "../contexts/AuthContext";
import { ErrorMessage } from "./Messages";
import { useGameContext } from "../contexts/GameContext";

type ControllButtonProps = {
    onClick: () => void;
    color?: string;
    Icon: ComponentType;
    disabled?: boolean;
}

const ControllButton = ({ onClick, color, Icon, disabled = false }: ControllButtonProps) => {
    return (
        <button
            className="bg-neutral-900 hover:bg-neutral-700 hover:cursor-pointer p-2 rounded-lg"
            onClick={onClick}
            style={{
                color,
                fontSize: "20px"
            }}
            disabled={disabled}
        >
            <Icon />
        </button>
    )
}

const GameController = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { jwt } = useAuthContext();
    const { isRunning, isPaused } = useGameContext();

    const ExecuteUpdate = (action: (jwt: string) => Promise<StandardStatus>) => {
        setError(null);
        setLoading(true);
        action(jwt!).catch((e: any) => setError(e.message)).finally(() => setLoading(false))
    }

    return (
        <div className="bg-neutral-800 rounded-b mb-5">
            <div className="bg-amber-400 text-black flex gap-1 px-2 items-center rounded-t text-sm uppercase">
                <FaLock /> <span>Game Controls</span>
            </div>
            <div className="p-4">
                {error && <ErrorMessage message={error} />}
                <div className="w-full pb-2 pt-3 flex flex-row items-center justify-around">
                    <ControllButton Icon={FaArrowRotateLeft} color="#ffb2b2" onClick={() => { }} disabled={loading} />
                    <ControllButton Icon={PiSkipBackFill} color="#a0c0ff" onClick={() => ExecuteUpdate(gameRewind)} disabled={loading} />

                    <ControllButton Icon={isRunning ? PiPauseFill : PiPlayFill} onClick={() => {
                        isPaused ? ExecuteUpdate(gameResume) : isRunning ? ExecuteUpdate(gamePause) : ExecuteUpdate(gameStart);
                    }} disabled={loading} />

                    <ControllButton Icon={PiSkipForwardFill} color="#a0c0ff" onClick={() => ExecuteUpdate(gameSkip)} disabled={loading} />
                    <ControllButton Icon={PiStopFill} color="#ffb2b2" onClick={() => ExecuteUpdate(gameEnd)} disabled={loading} />
                </div>
            </div>
        </div>
    )
}

export default GameController;