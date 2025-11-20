import { HiMiniUserGroup } from "react-icons/hi2";
import Container from "./Containers";
import DelayButton from "./DelayButton";
import { FaTrophy } from "react-icons/fa";

const TeamController = () => {
    return (
        <Container title="Team Controls" Icon={HiMiniUserGroup}>
            <div className="flex flex-row justify-between items-center bg-neutral-900 py-2 px-4 rounded">
                <span>Hold button to delcare victory</span>
                <DelayButton onClick={() => { }} Icon={FaTrophy} color="gold" />
            </div>
        </Container>
    )
}

export default TeamController;