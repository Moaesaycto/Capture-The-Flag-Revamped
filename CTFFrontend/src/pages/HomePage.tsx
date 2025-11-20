import { useCallback, useMemo } from "react";
import Page from "@/components/main/Page";
import JoinForm from "@/components/forms/JoinForm";
import { useAuthContext } from "@/components/contexts/AuthContext";
import PlayerList from "@/components/main/PlayerList";
import PlayerInfo from "@/components/main/PlayerInfo";
import GameController from "@/components/main/GameController";
import StateViewer from "@/components/main/StateViewer";
import Container from "@/components/main/Containers";
import { IoPerson } from "react-icons/io5";
import { useGameContext } from "@/components/contexts/GameContext";
import { playerLeave } from "@/services/PlayerApi";
import { RxExit } from "react-icons/rx";
import Color from "color";
import TeamController from "@/components/main/TeamController";

const HomePage = () => {
    const { loggedIn, me, jwt, logout, myTeam } = useAuthContext();
    const { removeMeFromGame } = useGameContext();

    const Controller = useMemo(() => (loggedIn ? PlayerInfo : JoinForm), [loggedIn, me]);

    const onClick = useCallback(() => {
        removeMeFromGame();
        playerLeave(jwt);
        logout();
        console.log('Logout complete');
    }, [jwt, logout, removeMeFromGame]);

    return (
        <Page>
            {me?.auth && <GameController />}
            <StateViewer />
            <Container title="Player information" Icon={IoPerson} >
                <Controller />
                <PlayerList />
                {jwt &&
                    <button
                        className="flex flex-row gap-2 items-center w-full justify-center
                                 text-red-500 border-2 border-red-800 p-1 rounded 
                                   hover:cursor-pointer"
                        onClick={onClick}
                        style={{
                            backgroundColor: Color("#9F0712").alpha(0.20).toString()
                        }}
                    >
                        <RxExit />
                        <span>Leave game</span>
                    </button>
                }
            </Container>
            {myTeam && <TeamController />}
        </Page>
    )
}


export default HomePage;