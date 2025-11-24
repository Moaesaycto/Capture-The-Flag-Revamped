import { useEffect, useState, useRef, useMemo } from "react";
import { useGameContext } from "../contexts/GameContext";
import type { IconType } from "react-icons";
import type { State } from "../../types";
import { FaBinoculars, FaFistRaised, FaFlagCheckered, FaHourglassHalf, FaShieldAlt } from "react-icons/fa";
import confetti from "canvas-confetti";
import Spinner from "./LoadingSpinner";
import { PiPauseFill, PiSnowflakeFill, PiWarning } from "react-icons/pi";
import { useAuthContext } from "../contexts/AuthContext";

type StateDisplay = {
    title: string,
    icon: IconType,
    color: string,
}

export const STATE_MAP: { [key in State]: StateDisplay } = {
    ready: {
        title: "Waiting to Start",
        icon: FaHourglassHalf,
        color: "#9696ff",
    },
    grace: {
        title: "Grace Period",
        icon: FaShieldAlt,
        color: "#28c926",
    },
    scout: {
        title: "Scout Period",
        icon: FaBinoculars,
        color: "#e2a600",
    },
    ffa: {
        title: "Flags Revealed",
        icon: FaFistRaised,
        color: "#dd3535"
    },
    ended: {
        title: "Game Over",
        icon: FaFlagCheckered,
        color: "#9696ff",
    }
};

// Reusable component for status displays
const StatusDisplay = ({
    icon: Icon,
    iconColor,
    title,
    subtitle,
    iconOpacity = 0.1
}: {
    icon: IconType,
    iconColor: string,
    title: React.ReactNode,
    subtitle?: string,
    iconOpacity?: number
}) => (
    <div className="w-full py-10 relative mb-10 mt-4 flex items-center justify-center">
        <Icon
            className="absolute text-gray-300"
            style={{
                fontSize: "12rem",
                opacity: iconOpacity,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 0,
                color: iconColor
            }}
        />
        <div className="h-30 flex flex-col items-center justify-center">
            <div className="text-5xl flex flex-row items-center gap-4">
                <span className="relative z-10 flex flex-row gap-4 items-center">{title}</span>
            </div>
            {subtitle && <span className="text-lg opacity-50">{subtitle}</span>}
        </div>
    </div>
);

const StateViewer = () => {
    const { myTeam } = useAuthContext();
    const { state, currentDuration, isPaused, isInGame, stateUpdateKey, health: gameHealth, emergency, frozen, winner } = useGameContext();
    const [displayTime, setDisplayTime] = useState(currentDuration);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setDisplayTime(currentDuration);

        const startTime = Date.now();
        const initialDuration = currentDuration;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!isInGame || isPaused) return;

        intervalRef.current = window.setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, initialDuration - elapsed);
            setDisplayTime(remaining);

            if (remaining <= 0 && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, 100);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [stateUpdateKey, isInGame, isPaused, currentDuration]);

    useEffect(() => {
        if (state === "ended" && myTeam && winner && myTeam.id === winner.id) {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.3 },
            });
        }
    }, [state, myTeam, winner]);

    const totalSeconds = Math.floor(displayTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    const stateDisplay = useMemo(() => STATE_MAP[state as State] ?? {
        title: "",
        icon: PiPauseFill,
        color: "#999",
    }, [state]);

    const Icon = isPaused ? PiPauseFill : stateDisplay.icon;

    if (!gameHealth) {
        return (
            <StatusDisplay
                icon={PiWarning}
                iconColor="red"
                title={
                    <>
                        Connecting
                        <Spinner />
                    </>
                }
                subtitle="If it doesn't load soon, try refreshing the page"
            />
        );
    }

    if (winner) {
        if (!myTeam)
            return (
                <StatusDisplay
                    icon={FaFlagCheckered}
                    iconColor={winner.color}
                    title={winner.name.toLocaleUpperCase() + " HAS WON"}
                    subtitle="The game has ended, return to the rendezvous point."
                />
            );

        return (
            <StatusDisplay
                icon={FaFlagCheckered}
                iconColor={winner.color}
                title={myTeam.id === winner.id ? "YOU WIN" : "YOU LOSE"}
                subtitle={myTeam.id === winner.id ? "Great job! Return to the rendezvous point." : "Return to the rendezvous point for another try!"}
            />
        )
    }

    if (frozen) {
        return (
            <StatusDisplay
                icon={PiSnowflakeFill}
                iconColor="#77c2ff"
                title="HALTED"
                subtitle="All flags must be registered to continue the game"
            />
        )
    }

    if (emergency) {
        return (
            <StatusDisplay
                icon={PiWarning}
                iconColor="gold"
                title="EMERGENCY"
                subtitle="Return to the rendezvous point immediately"
            />
        );
    }

    // Main timer display
    return (
        <div className="w-full py-10 relative mb-10 mt-4 flex items-center justify-center">
            <Icon
                className="absolute text-gray-300"
                style={{
                    fontSize: "12rem",
                    opacity: 0.1,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 0,
                    color: isPaused ? "#9696ff" : stateDisplay.color
                }}
            />
            <div className="h-30 flex flex-col items-center">
                <span
                    className="text-8xl relative z-10"
                    style={{ opacity: isPaused ? 0.5 : 1 }}
                >
                    {minutes}:{seconds}
                </span>
                <span className="text-3xl relative z-10">{stateDisplay.title}</span>
            </div>
        </div>
    );
};

export default StateViewer;