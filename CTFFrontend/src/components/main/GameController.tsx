import { FaArrowRotateLeft } from "react-icons/fa6";
import { PiPlayFill, PiSkipBackFill, PiSkipForwardFill, PiStopFill } from "react-icons/pi";

const GameController = () => {
    return (
        <div className="w-full h-10 bg-neutral-700 rounded mb-4 flex flex-row items-center justify-around">
            <button>
                <FaArrowRotateLeft color="#ffb2b2" />
            </button>
            <button>
                <PiSkipBackFill color="#a0c0ff" />
            </button>
            <button>
                <PiPlayFill />
            </button>
            <button>
                <PiSkipForwardFill color="#a0c0ff" />
            </button>
            <button>
                <PiStopFill color="#ffb2b2" />
            </button>
        </div>
    )
}

export default GameController;