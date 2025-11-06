import type { ReactNode } from "react"
import { PiWifiXBold } from "react-icons/pi"
import Spinner from "./LoadingSpinner"
import { useAuthContext } from "../contexts/AuthContext";

type PageProps = {
    children?: ReactNode;
}

const Page = ({ children }: PageProps) => {
    const { loading, healthy } = useAuthContext();

    if (loading) return <Loading />
    if (!healthy) return <NoConnection />

    return (
        <div className="flex flex-col flex-1 w-full h-full text-white">
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
