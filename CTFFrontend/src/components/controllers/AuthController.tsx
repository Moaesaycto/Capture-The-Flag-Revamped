import { RiAdminFill } from "react-icons/ri";
import Container from "../main/Containers";
import { useState } from "react";
import DelayButton from "../main/DelayButton";
import { useGameContext } from "../contexts/GameContext";
import { useAuthContext } from "../contexts/AuthContext";
import { gameAnnounce, releaseEmergency } from "@/services/GameApi";
import { FaUnlock } from "react-icons/fa";
import { PiWarningBold } from "react-icons/pi";
import { ErrorMessage } from "../main/Messages";

const AuthController = () => {
    const [error, setError] = useState<string | null>(null);

    const { jwt } = useAuthContext();
    const { emergency } = useGameContext();

    return (
        <Container title="Admin Controls" Icon={RiAdminFill}>
            {error && <ErrorMessage message={error} />}
            <div className="flex flex-row justify-between items-center bg-neutral-900 py-2 px-4 rounded gap-2">
                <div className="flex flex-col gap-1 flex-1">
                    <span className="flex-1">
                        {emergency ? "Hold to release emergency lock":"Hold to delcare emergency"}</span>
                    <span className="text-xs text-neutral-500 flex-1">
                        {emergency ? "Unlock the emergency to resume the game." : "This is a very serious game state. Activate with caution."}</span>
                </div>
                <div className="h-full">
                    <DelayButton
                        Icon={emergency ? FaUnlock : PiWarningBold}
                        onClick={emergency ? () => releaseEmergency(jwt!) : () => gameAnnounce("emergency", "", jwt!)}
                        onError={(e: any) => setError(e.message)}
                        onSuccess={() => setError("")}
                        color="gold"
                    />
                </div>
            </div>

        </Container>
    );
}


export default AuthController