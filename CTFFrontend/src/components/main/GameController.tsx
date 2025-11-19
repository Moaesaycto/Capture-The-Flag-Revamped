import { useState, type ComponentType } from "react";
import { FaArrowRotateLeft, FaLock } from "react-icons/fa6";
import { PiPauseFill, PiPlayFill, PiSkipBackFill, PiSkipForwardFill, PiStopFill } from "react-icons/pi";
import type { StandardStatus } from "../../types";
import { gameEnd, gamePause, gameReset, gameResume, gameRewind, gameSkip, gameStart, releaseEmergency } from "../../services/GameApi";
import { useAuthContext } from "../contexts/AuthContext";
import { ErrorMessage } from "./Messages";
import { useGameContext } from "../contexts/GameContext";
import Container from "./Containers";

type ControlButtonProps = {
    onClick: () => void;
    color?: string;
    Icon: ComponentType;
    disabled?: boolean;
}

const ControlButton = ({ onClick, color, Icon, disabled = false }: ControlButtonProps) => {
    return (
        <button
            className="bg-neutral-900 hover:bg-neutral-700 hover:cursor-pointer p-2 rounded-lg disabled:opacity-50 disabled:hover:bg-neutral-900 disabled:cursor-not-allowed"
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
    const { isInGame, isPaused, state, emergency } = useGameContext();

    const ExecuteUpdate = (action: (jwt: string) => Promise<StandardStatus>) => {
        setError(null);
        setLoading(true);
        action(jwt!).catch((e: any) => setError(e.message)).finally(() => setLoading(false))
    }

    const release = () => {
        setError(null);
        setLoading(true);
        if (!jwt) {
            setError("No valid JWT set");
            return;
        }
        releaseEmergency(jwt)
            .catch((e: any) => setError(e.message))
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <Container Icon={FaLock} title="Game Controls">
            {error && <ErrorMessage message={error} />}
            <div className="w-full pb-2 pt-3 flex flex-row items-center justify-around">
                {/* Reset Button */}
                <ControlButton
                    Icon={FaArrowRotateLeft}
                    color="#ffb2b2"
                    onClick={() => ExecuteUpdate((jwt) => gameReset(false, jwt))}
                    disabled={emergency || loading}
                />

                {/* Rewind Button */}
                <ControlButton
                    Icon={PiSkipBackFill}
                    color="#a0c0ff"
                    onClick={() => ExecuteUpdate(gameRewind)}
                    disabled={emergency || loading || state === "ready"}
                />

                {/* Play / Pause Button */}
                <ControlButton
                    Icon={isPaused || !isInGame ? PiPlayFill : PiPauseFill}
                    onClick={() => {
                        isPaused ? ExecuteUpdate(gameResume) : isInGame ? ExecuteUpdate(gamePause) : ExecuteUpdate(gameStart);
                    }}
                    disabled={emergency || loading || state == "ended"}
                />

                {/* Skip Button */}
                <ControlButton
                    Icon={PiSkipForwardFill}
                    color="#a0c0ff"
                    onClick={() => ExecuteUpdate(gameSkip)}
                    disabled={emergency || loading || state === "ready" || state === "ended"}
                />

                {/* Stop Button */}
                <ControlButton
                    Icon={PiStopFill}
                    color="#ffb2b2"
                    onClick={() => ExecuteUpdate(gameEnd)}
                    disabled={emergency || loading || state === "ready" || state === "ended"}
                />
            </div>
            {emergency &&
                <button
                    onClick={release}
                    className={`bg-red-400 text-black w-full h-7.5 rounded flex justify-center items-center
                               hover:bg-red-500 hover:cursor-pointer disabled:hover:cursor-not-allowed
                               disabled:hover:bg-red-400 disabled:opacity-50 mt-4`}
                >
                    Release Emergency
                </button>}
        </Container>
    )
}

export default GameController;