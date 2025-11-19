import Color from "color";
import { ImWarning } from "react-icons/im";

export const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <div
            className="w-full border-3 border-red-800 rounded p-2 flex flex-row items-center gap-2 text-red-500 mb-3"
            style={{ backgroundColor: Color("#9F0712").alpha(0.2).toString() }}
        >
            <ImWarning />
            <span>
                {message}
            </span>
        </div>
    )
}

export const WarningMessage = ({ message }: { message: string }) => {
    return (
        <div
            className="w-full border-b-3 border-amber-800 p-2 flex flex-row items-center gap-2 text-amber-500 mb-5"
            style={{ backgroundColor: Color("#9F0712").alpha(0.2).toString() }}
        >
            <ImWarning />
            <span>
                {message}
            </span>
        </div>
    )
}

export const Announcement = ({ message }: { message: string }) => {
    return (
        <div
            className="w-full"
        >
            <span>
                {message}
            </span>
        </div>
    )
}