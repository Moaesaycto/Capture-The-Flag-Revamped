import Page from "../components/main/Page";
import JoinForm from "../components/forms/JoinForm";
import { useAuthContext } from "../components/contexts/AuthContext";
import PlayerList from "../components/main/PlayerList";
import PlayerInfo from "../components/main/PlayerInfo";
import { useMemo } from "react";
import Map from "../components/main/Map";
import GameController from "../components/main/GameController";
import StateViewer from "../components/main/StateViewer";
import AnnouncementController from "@/components/main/AnnouncementController";
import { useGameContext } from "@/components/contexts/GameContext";
import { WarningMessage } from "@/components/main/Messages";

const HomePage = () => {
    const { loggedIn, me } = useAuthContext();
    const { emergency } = useGameContext();

    const Controller = useMemo(() => (loggedIn ? PlayerInfo : JoinForm), [loggedIn, me]);

    return (
        <Page>
            {emergency && <WarningMessage message="An emergency has been declared. Return to the rendezvous point immediately." />}
            <StateViewer />
            {me?.auth && <GameController />}
            {me?.auth && <AnnouncementController />}
            <Controller />
            <PlayerList />
            <Map />
        </Page>
    )
}


export default HomePage;