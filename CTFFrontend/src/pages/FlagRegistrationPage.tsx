import { useGameContext } from "@/components/contexts/GameContext";
import Page from "@/components/main/Page"
import TeamFlagRegistration from "@/components/team/TeamFlagRegistration";
import { useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const FlagRegistrationPage = () => {
    const navigate = useNavigate();
    const { state } = useGameContext();

    useEffect(() => {
        if (state !== "grace") navigate("/");
    }, [state]);

    return (
        <Page>
            <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-4 items-center">
                    <h2
                        className="text-4xl flex-1"
                        style={{ fontFamily: "American Captain" }}
                    >
                        Register Flag
                    </h2>
                    <div
                        className="text-black bg-amber-400 p-1 rounded text-2xl w-8 h-8 flex items-center 
                                     justify-center hover:bg-amber-300 hover:cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <IoChevronBack />
                    </div>
                </div>
                <p>
                    Click on the map below to indicate the location of your flag.
                </p>
                <TeamFlagRegistration />
            </div>
        </Page>
    )
}

export default FlagRegistrationPage;