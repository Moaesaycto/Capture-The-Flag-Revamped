import { useGameContext } from "../contexts/GameContext";

const StateViewer = () => {
    const { state } = useGameContext();

    return (
        <div>
            {state}
        </div>
    )
}

export default StateViewer;