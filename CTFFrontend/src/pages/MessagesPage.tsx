import Page from "../components/main/Page";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiGlobeBold } from "react-icons/pi";
import type { IconType } from "react-icons";
import { FaFlag } from "react-icons/fa6";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaPaperPlane } from "react-icons/fa";
import { useGameContext } from "../components/contexts/GameContext";
import Color from "color";

type Chat = {
    icon: IconType,
    title: string,
    path: string,
}

type ChatMessage = {
    playerName: string,
    playerId: string,
    content: string,
    team: string,
}

const MAX_MESSAGE_LENGTH = import.meta.env.VITE_MAX_MESSAGE_LENGTH ?? 256;

const TEMP_MESSAGES = [
    {
        playerName: "Vagoina",
        playerId: "ccf8e26f-6752-4f44-ae3a-97a7d0851570",
        content: "moi vagoina stinks",
        team: "123123"
    }, {
        playerName: "123",
        playerId: "b954d78a-43c3-40f6-bc53-cc72146c5e63",
        content: "gros fsdkj kjsdhf kjsdhjkf hjkhsdkjfjksd fhjks hdjkfh jksdf hkjshdfjk hsdkjf hkjsdhfjkdshjksdjkfskjdf hjksd hfjksdhjkfhsdkjfhjksdfhjksd hjksdhfjkshdjkhsdjkfhjksd hfjksdhjk hsdjkfh jksds",
        team: "75b72c36-b3ff-45ac-be81-24a7e63c3535",
    }
]

const Message = ({ message }: { message: ChatMessage }) => {
    const { me } = useAuthContext();
    const { getTeamFromId } = useGameContext();

    const isMe = me?.id === message.playerId;
    const teamColor = getTeamFromId(message.team)?.color ?? "#ffffff"

    return <li
        className={`py-2 px-4 rounded-2xl flex flex-col
            ${isMe ? "ml-10 rounded-br-sm" : "mr-10 rounded-bl-sm"}`}
        style={{
            backgroundColor: Color(teamColor).alpha(0.25).toString(),
        }}
    >
        <span
            className="text-xs"
            style={{ color: Color(teamColor).lighten(0.25).toString() }}
        >
            {message.playerName}
        </span>
        <span>
            {message.content}
        </span>
    </li>
}

const MessagesPage = () => {
    const { loggedIn, me, myTeam } = useAuthContext();
    const navigate = useNavigate();

    const [chats, setChats] = useState<Chat[]>([]);
    const [openChat, setOpenChat] = useState<string | null>(null);
    const [currMessage, setCurrMessage] = useState<string>("");

    const canSend = useMemo<boolean>(() => {
        const rightState = !!openChat;
        const textOk = currMessage.length < 1 || currMessage.length > MAX_MESSAGE_LENGTH;

        return rightState && textOk;
    }, [openChat, currMessage]);

    useEffect(() => {
        if (!loggedIn) navigate("/");
    }, [loggedIn, navigate])

    useEffect(() => {
        const newChats = [
            {
                icon: PiGlobeBold,
                title: "Global",
                path: "global",
            },
        ];

        if (myTeam) {
            newChats.push({
                icon: FaFlag,
                title: `${myTeam.name} Team`,
                path: `team/${myTeam.id}`,
            });
        }

        setChats(newChats);
    }, [myTeam]);

    const sendMessage = (message: string) => {

        if (message)
            console.log("Sent:", message);
    }

    return (
        <Page>
            <div className="bg-amber-400 h-8 w-full rounded-t-md flex flex-row items-center justify-around text-black text-lg gap-2 px-1">
                {chats.map((c, k) =>
                    <li
                        className={`list-none flex items-center gap-2 h-6 justify-center rounded-md flex-1 hover:cursor-pointer
                            ${openChat == c.path ? "bg-amber-500 hover:bg-orange-400 shadow-xl" : "hover:bg-amber-300 "}
                            `}
                        onClick={() => {
                            setOpenChat(c.path);
                        }}
                        key={k}
                    >
                        <c.icon />
                        <span>{c.title}</span>
                    </li>
                )}
            </div>
            <div className="bg-neutral-950 w-full h-full rounded-b-md flex flex-col">
                {openChat ?
                    <ul className="flex-1 p-5 flex flex-col gap-4">
                        {TEMP_MESSAGES.map((m, k) => <Message message={m} key={k} />)}
                    </ul> :
                    <div className="w-full flex-1 flex items-center justify-center flex-col gap-5">
                        <HiMiniChatBubbleBottomCenterText size={128} color={"#171717"} />
                        <span className="text-neutral-500 w-1/2 text-center">
                            Select a chat from the above list to start messaging!
                        </span>
                    </div>}
                <div>
                    {currMessage.length > MAX_MESSAGE_LENGTH &&
                        <div className="text-xs px-4 h-2 text-red-800">
                            Messages cannot be above {MAX_MESSAGE_LENGTH} characters
                        </div>
                    }
                    <div
                        className="py-4 px-4 flex flex-row gap-4 items-center"
                    >
                        <input
                            className={`bg-neutral-900 w-full py-1 px-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none
                            disabled:hover:cursor-not-allowed disabled:opacity-50`}
                            placeholder={`Message as ${me?.name}`}
                            disabled={!openChat}
                            onChange={(e) => setCurrMessage(e.target.value.trim())}
                            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(currMessage); }}
                        />
                        <button
                            className={`bg-amber-400 text-black w-10 h-7.5 rounded flex justify-center items-center
                            hover:bg-amber-500 hover:cursor-pointer disabled:hover:cursor-not-allowed
                            disabled:hover:bg-amber-400 disabled:opacity-50`}
                            disabled={canSend}
                            onClick={() => sendMessage(currMessage)}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>
        </Page>
    )
}


export default MessagesPage;