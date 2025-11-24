import { HiMiniUserGroup } from "react-icons/hi2";
import Container from "../main/Containers";
import { FaFlag, FaTrophy } from "react-icons/fa";
import { useGameContext } from "../contexts/GameContext";
import { useCallback, useMemo, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { ErrorMessage, SuccessMessage, WarningMessage } from "../main/Messages";
import LabelDelayButton from "../main/Buttons";
import { useNavigate } from "react-router-dom";
import MapViewer from "../team/MapViewer";
import { useSettingsContext } from "../contexts/SettingsContext";
import { declareVictory } from "@/services/TeamApi";

const TeamController = () => {
    const { state, isPaused, isInGame } = useGameContext();
    const { alwaysShowMap } = useSettingsContext();
    const { myTeam, jwt } = useAuthContext();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const canDeclareVictory = useMemo(() => {
        return !isPaused && (state === "ffa" || state === "scout");
    }, [state, isPaused]);

    const victoryCall = useCallback(async () => {
        setError(null);
        if (!myTeam || !jwt) {
            setError("Credentials not valid");
            return;
        }

        await declareVictory(myTeam.id, jwt);
    }, [jwt, myTeam]);

    return (
        <Container title="Team Controls" Icon={HiMiniUserGroup}>
            <div className="flex flex-col gap-4">
                {error && <ErrorMessage message={error} />}
                {state === "grace" && (myTeam?.registered ?
                    <SuccessMessage message="Your team has registered their flag's location" /> :
                    <WarningMessage message="Your team has not registered a flag yet!" />
                )}
                {(isInGame || alwaysShowMap) && <MapViewer />}
                {state === "grace" &&
                    <LabelDelayButton
                        title="Register flag"
                        description="Hold to go to flag registration page."
                        onClick={() => navigate("/register-flag")}
                        Icon={FaFlag}
                        color="gold"
                        disabled={state !== "grace"}
                    />}
                <LabelDelayButton
                    title="Hold to delcare victory"
                    description="This will immediately end the game. Activate with caution."
                    onClick={victoryCall}
                    onError={(e) => setError(e.message)}
                    Icon={FaTrophy}
                    color="gold"
                    disabled={!canDeclareVictory}
                />
            </div>
        </Container>
    )
}

export default TeamController;