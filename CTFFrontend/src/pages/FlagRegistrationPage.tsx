import { useGameContext } from "@/components/contexts/GameContext";
import Page from "@/components/main/Page"
import TeamFlagRegistration from "@/components/team/TeamFlagRegistration";
import { useEffect } from "react";
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
                <h2
                    className="text-4xl"
                    style={{ fontFamily: "American Captain" }}
                >
                    Register Flag
                </h2>
                <p>
                    Click on the map below to indicate the location of your flag.
                </p>
                <TeamFlagRegistration />
            </div>
        </Page>
    )
}

export default FlagRegistrationPage;