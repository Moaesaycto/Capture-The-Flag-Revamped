import type { ReactNode } from "react"
import { PiWifiXBold } from "react-icons/pi"
import Spinner from "./LoadingSpinner"
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import { WarningMessage } from "./Messages";
import { usePushNotifications } from "@/services/usePushNotifications";

type PageProps = {
    children?: ReactNode;
}

const Page = ({ children }: PageProps) => {
    const { authLoading, healthy } = useAuthContext();
    const { emergency, loading, health } = useGameContext();
    const { subscription, subscribe, unsubscribe } = usePushNotifications();

    if (authLoading || loading || !health) return <Loading />
    if (!healthy) return <NoConnection />

    return (
        <div className="flex flex-col flex-1 w-full min-h-0 text-white py-5 px-5">
            {!subscription ? <button onClick={subscribe}>Enable Notifications</button> : <button onClick={unsubscribe}>Disable Notifications</button>}

            {emergency && <WarningMessage message="An emergency has been declared. Return to the rendezvous point immediately." />}
            {children}
        </div>
    )
}

const Loading = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-800">
        <div className="text-white">
            <Spinner size={100} />
        </div>
    </div>
)

const NoConnection = () => (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-800 text-white">
        <PiWifiXBold size={64} className="text-red-500 mb-4" />
        <p className="text-lg">No Connection to Server</p>
        <p className="opacity-50">
            It seems the game has not started yet
        </p>
    </div>
)

export default Page
