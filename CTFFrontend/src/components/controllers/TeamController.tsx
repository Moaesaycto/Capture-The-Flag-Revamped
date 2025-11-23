import { HiMiniUserGroup } from "react-icons/hi2";
import Container from "../main/Containers";
import DelayButton from "../main/DelayButton";
import { FaTrophy } from "react-icons/fa";
import { useGameContext } from "../contexts/GameContext";
import { useMemo } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { SuccessMessage, WarningMessage } from "../main/Messages";

const TeamController = () => {
    const { state, isPaused } = useGameContext();
    const { myTeam } = useAuthContext();

    const canDeclareVictory = useMemo(() => {
        return !isPaused && (state === "ffa" || state === "scout");
    }, [state, isPaused]);

    return (
        <Container title="Team Controls" Icon={HiMiniUserGroup}>
            <div className="flex flex-col gap-4">
                {myTeam?.registered ?
                    <SuccessMessage message="Your team has registered their flag's location" /> :
                    <WarningMessage message="Your team has not registered a flag yet!" />
                }
                <div className="flex flex-row justify-between items-center bg-neutral-900 py-2 px-4 rounded gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                        <span className="flex-1">Hold to delcare victory</span>
                        <span className="text-xs text-neutral-500 flex-1">This will immediately end the game. Activate with caution.</span>
                    </div>
                    <div className="h-full">
                        <DelayButton onClick={() => { }} Icon={FaTrophy} color="gold" disabled={!canDeclareVictory} />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default TeamController;