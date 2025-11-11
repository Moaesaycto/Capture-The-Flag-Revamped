import Page from "../components/main/Page";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MessagesPage = () => {
    const { loggedIn } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) navigate("/");
    }, [loggedIn, navigate])

    return (
        <Page>

        </Page>
    )
}


export default MessagesPage;