import { RiAdminFill } from "react-icons/ri";
import Container from "../main/Containers";
import { useState } from "react";
import { useGameContext } from "../contexts/GameContext";
import { useAuthContext } from "../contexts/AuthContext";
import { gameAnnounce, releaseEmergency } from "@/services/GameApi";
import { FaUnlock } from "react-icons/fa";
import { PiWarningBold } from "react-icons/pi";
import { ErrorMessage } from "../main/Messages";
import LabelDelayButton from "../main/Buttons";

const AuthController = () => {
    const [error, setError] = useState<string | null>(null);

    const { jwt } = useAuthContext();
    const { emergency } = useGameContext();

    return (
        <Container title="Admin Controls" Icon={RiAdminFill}>
            {error && <ErrorMessage message={error} />}
            <LabelDelayButton
                title={emergency ? "Hold to release emergency lock" : "Hold to declare emergency"}
                description={emergency ? "Unlock the emergency to resume the game." : "This is a very serious game state. Activate with caution."}
                Icon={emergency ? FaUnlock : PiWarningBold}
                onClick={emergency ? () => releaseEmergency(jwt!) : () => gameAnnounce("emergency", "", jwt!)}
                onError={(e: any) => setError(e.message)}
                onSuccess={() => setError("")}
                color="gold"
            />
        </Container>
    );
}


export default AuthController