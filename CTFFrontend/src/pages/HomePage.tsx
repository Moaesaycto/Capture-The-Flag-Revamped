import Page from "../components/main/Page";
import JoinForm from "../components/forms/JoinForm";
import { useAuthContext } from "../components/contexts/AuthContext";
import PlayerList from "../components/main/PlayerList";
import PlayerInfo from "../components/main/PlayerInfo";
import { useMemo } from "react";
import Map from "../components/main/Map";
import GameController from "../components/main/GameController";
import StateViewer from "../components/main/StateViewer";

const HomePage = () => {
    const { loggedIn, me } = useAuthContext();

    const Controller = useMemo(() => (loggedIn ? PlayerInfo : JoinForm), [loggedIn, me]);

    return (
        <Page>
            <Controller />
            <StateViewer />
            {me?.auth && <GameController />}
            <PlayerList />
            <Map />
        </Page>
    )
}


export default HomePage;