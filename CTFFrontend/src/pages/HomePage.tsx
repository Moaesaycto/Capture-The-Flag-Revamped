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
import { useSettingsContext } from "@/components/contexts/SettingsContext";
import MoreInfo from "@/components/game/MoreInfo";
import MapViewer from "@/components/team/MapViewer";

const HomePage = () => {
    const { loggedIn, me, myTeam } = useAuthContext();
    const { wantsMoreDetails } = useSettingsContext();

    const Controller = useMemo(() => (loggedIn ? PlayerInfo : JoinForm), [loggedIn, me]);

    return (
        <Page>
            {me?.auth && <GameController />}
            <StateViewer />
            <Container title="Player information" Icon={IoPerson}>
                <Controller />
                <PlayerList />
            </Container>
            {myTeam && <TeamController />}
            {wantsMoreDetails && <MoreInfo />}
            {me?.auth && <AuthController />}
            {!me && <MapViewer />}
        </Page>
    )
}


export default HomePage;