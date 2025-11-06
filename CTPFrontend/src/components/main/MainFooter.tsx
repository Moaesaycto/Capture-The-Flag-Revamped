import { BiCopyright } from "react-icons/bi";

const MainFooter = () => {
    return (
        <div className="bg-amber-400 z-1">
            <div className="construction-pattern h-2" />
            <div className="w-full text-center py-3 px-10 flex justify-between">
                <span>
                    Capture the Flag
                </span>
                <div className="flex flex-row items-center gap-1">
                    <BiCopyright />
                    <span>
                        MOAE {new Date().getFullYear()}
                    </span>
                </div>
                <span>
                    <a
                        href="https://moae.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Main Page
                    </a>
                </span>
            </div>
        </div>
    )
}

export default MainFooter;