import Page from "../components/main/Page";
import JoinForm from "../components/forms/JoinForm";
import { useAuthContext } from "../components/contexts/AuthContext";
import PlayerList from "../components/main/PlayerList";
import PlayerInfo from "../components/main/PlayerInfo";
import { useMemo } from "react";
import Map from "../components/main/Map";

const HomePage = () => {
    const { loggedIn } = useAuthContext();

    const Controller = useMemo(() => (loggedIn ? PlayerInfo : JoinForm), [loggedIn]);

    return (
        <Page>
            <Controller />
            <PlayerList />
            <Map />
        </Page>
    )
}


export default HomePage;