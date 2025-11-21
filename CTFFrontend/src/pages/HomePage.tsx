import { useMemo } from "react";
import Page from "@/components/main/Page";
import JoinForm from "@/components/forms/JoinForm";
import { useAuthContext } from "@/components/contexts/AuthContext";
import PlayerInfo from "@/components/players/PlayerInfo";
import GameController from "@/components/controllers/GameController";
import StateViewer from "@/components/main/StateViewer";
import Container from "@/components/main/Containers";
import { IoPerson } from "react-icons/io5";
import TeamController from "@/components/controllers/TeamController";
import PlayerList from "@/components/players/PlayerList";
import AuthController from "@/components/controllers/AuthController";

const HomePage = () => {
    const { loggedIn, me, myTeam } = useAuthContext();

    const Controller = useMemo(() => (loggedIn ? PlayerInfo : JoinForm), [loggedIn, me]);

    return (
        <Page>
            {me?.auth && <GameController />}
            <StateViewer />
            <Container title="Player information" Icon={IoPerson} id="player-information">
                <Controller />
            <PlayerList />
            </Container>
            {myTeam && <TeamController />}
            {me?.auth && <AuthController />}
        </Page>
    )
}


export default HomePage;