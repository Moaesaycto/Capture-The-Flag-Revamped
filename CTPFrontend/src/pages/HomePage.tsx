import Page from "../components/main/Page";
import JoinForm from "../components/forms/JoinForm";
import { useAuthContext } from "../components/contexts/AuthContext";

const HomePage = () => {
    const { loggedIn } = useAuthContext();

    return (
        <Page>
            {loggedIn ? <PlayerInfo /> : <JoinForm />}
        </Page>
    )
}

const PlayerInfo = () => {
    const {me} = useAuthContext();

    return (
        <div>
            {me?.name}
        </div>
    )
}

export default HomePage;