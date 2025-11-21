import { useMemo } from "react";
import Page from "@/components/main/Page";
import JoinForm from "@/components/forms/JoinForm";
import { useAuthContext } from "@/components/contexts/AuthContext";
import PlayerInfo from "@/components/main/PlayerInfo";
import GameController from "@/components/main/GameController";
import StateViewer from "@/components/main/StateViewer";
import Container from "@/components/main/Containers";
import { IoPerson } from "react-icons/io5";
import TeamController from "@/components/main/TeamController";
import PlayerList from "@/components/main/PlayerList";

const HomePage = () => {
    const { loggedIn, me, myTeam } = useAuthContext();

    const Controller = useMemo(() => (loggedIn ? PlayerInfo : JoinForm), [loggedIn, me]);

    return (
        <Page>
            {me?.auth && <GameController />}
            <StateViewer />
            <Container title="Player information" Icon={IoPerson} >
                <Controller />
            <PlayerList />
            </Container>
            {myTeam && <TeamController />}
        </Page>
    )
}


export default HomePage;