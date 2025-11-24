import { HiMiniUserGroup } from "react-icons/hi2";
import Container from "../main/Containers";
import { FaFlag, FaTrophy } from "react-icons/fa";
import { useGameContext } from "../contexts/GameContext";
import { useMemo } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { SuccessMessage, WarningMessage } from "../main/Messages";
import TeamFlagRegistration from "../team/TeamFlagRegistration";
import LabelDelayButton from "../main/Buttons";
import { useNavigate } from "react-router-dom";

const TeamController = () => {
    const { state, isPaused } = useGameContext();
    const { myTeam } = useAuthContext();
    const navigate = useNavigate();

    const canDeclareVictory = useMemo(() => {
        return !isPaused && (state === "ffa" || state === "scout");
    }, [state, isPaused]);

    return (
        <Container title="Team Controls" Icon={HiMiniUserGroup}>
            <div className="flex flex-col gap-4">
                {state === "grace" && (myTeam?.registered ?
                    <SuccessMessage message="Your team has registered their flag's location" /> :
                    <WarningMessage message="Your team has not registered a flag yet!" />
                )}
                <TeamFlagRegistration />

                {state === "grace" && (!myTeam?.registered ?
                    <LabelDelayButton
                        title="Register flag"
                        description="Hold to go to flag registration page."
                        onClick={() => navigate("/register-flag")}
                        Icon={FaFlag}
                        color="gold"
                        disabled={state !== "grace"}
                    /> : null)}
                <LabelDelayButton
                    title="Hold to delcare victory"
                    description="This will immediately end the game. Activate with caution."
                    onClick={() => { }}
                    Icon={FaTrophy}
                    color="gold"
                    disabled={!canDeclareVictory}
                />
            </div>
        </Container>
    )
}

export default TeamController;