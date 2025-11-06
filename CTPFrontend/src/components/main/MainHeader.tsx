import { PiFlagBannerFoldDuotone } from "react-icons/pi";

const MainHeader = () => {
    return (
        <header className="w-full bg-amber-400 text-5xl" style={{ fontFamily: "American Captain" }}>
            <div className="flex flex-row gap-2 px-3 py-0">
                <PiFlagBannerFoldDuotone />
                <h1>
                    Capture The Flag
                </h1>
            </div>
            <div className="w-full h-2 construction-pattern" />
        </header>
    )
}

export default MainHeader;