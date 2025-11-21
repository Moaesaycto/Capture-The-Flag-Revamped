import { useCallback, useState, type ChangeEvent, type ComponentType } from "react";
import { FaArrowRotateLeft, FaLock, FaPaperPlane } from "react-icons/fa6";
import { PiPauseFill, PiPlayFill, PiSkipBackFill, PiSkipForwardFill, PiStopFill, PiWarningBold } from "react-icons/pi";
import { type StandardStatus } from "@/types";
import { gameAnnounce, gameEnd, gamePause, gameReset, gameResume, gameRewind, gameSkip, gameStart, releaseEmergency } from "@/services/GameApi";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { ErrorMessage } from "@/components/main/Messages";
import { useGameContext } from "@/components/contexts/GameContext";
import Container from "@/components/main/Containers";
import { FaUnlock } from "react-icons/fa";
import DelayButton from "./DelayButton";

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
    return (
        <Container Icon={FaLock} title="Game Controls">
            <GameControls />
            {/* <div className="h-5" />
            <AnnouncementController /> */}
        </Container>
    )
}

const GameControls = () => {
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
        <div>
            {error && <ErrorMessage message={error} />}
            <div className="w-full pt-1 flex flex-row items-center justify-around">
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

                {/* Emergency Button */}
                <DelayButton
                    Icon={emergency ? FaUnlock : PiWarningBold}
                    onClick={emergency ? release : () => gameAnnounce("emergency", "", jwt!)}
                    onError={(e: any) => setError(e.message)}
                    onSuccess={() => setError("")}
                    color="gold"
                />
            </div>
        </div>
    );
}

export const AnnouncementController = () => {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { jwt } = useAuthContext();

    const submit = useCallback(() => {
        if (!jwt) return;

        setLoading(true);
        gameAnnounce("custom", message, jwt)
            .catch((e: any) => setError(e.message))
            .finally(() => setLoading(false));

    }, [setError, message, jwt]);

    return (
        <div>
            {error && <ErrorMessage message={error} />}
            <div className="flex gap-3 items-center">
                <input
                    className="bg-neutral-900 py-1 px-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none flex-1"
                    name="name"
                    placeholder="Enter announcement message"
                    autoComplete="off"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                />
                <button
                    className={`bg-amber-400 text-black w-10 h-7.5 rounded flex justify-center items-center
                               hover:bg-amber-500 hover:cursor-pointer disabled:hover:cursor-not-allowed
                               disabled:hover:bg-amber-400 disabled:opacity-50`}
                    onClick={submit}
                    disabled={loading || !message}
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>

    )
}

export default GameController;