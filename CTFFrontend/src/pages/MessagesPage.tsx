import Page from "../components/main/Page";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useEffect, useState } from "react";
import { PiGlobeBold } from "react-icons/pi";

import { FaFlag } from "react-icons/fa6";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { useMessageContext } from "../components/contexts/MessageContext";
import { ChatWindow } from "../components/messages/ChatWindow";
import MessageInput from "../components/messages/MessageInput";
import type { Chat, ChatType } from "../types";
import ChatTabs from "../components/messages/ChatTabs";

const MAX_MESSAGE_LENGTH = import.meta.env.VITE_MAX_MESSAGE_LENGTH ?? 256;

const MessagesPage = () => {
    const { me, myTeam } = useAuthContext();
    const {
        sendMessage,
        openChat,
        setOpenChat,
        dirtyGlobal,
        setDirtyGlobal,
        dirtyTeams,
        setDirtyTeams,
        restoreOpen,
        canLoadMoreGlobal,
        canLoadMoreTeam,
        displayChats,
        pendingChats,
        currMessage,
        setCurrMessage,
    } = useMessageContext();

    const [chats, setChats] = useState<Chat[]>([]);

    // Returning to last viewed page
    useEffect(() => {
        restoreOpen();
    }, []);

    useEffect(() => {
        return () => {
            setOpenChat(null);
        };
    }, [setOpenChat]);


    useEffect(() => {
        const newChats = [
            {
                icon: PiGlobeBold,
                title: "Global",
                path: "global",
                type: "global" as ChatType,
                setDirty: setDirtyGlobal,
                dirty: dirtyGlobal,
            },
        ];

        if (myTeam) {
            newChats.push({
                icon: FaFlag,
                title: `${myTeam.name} Team`,
                path: `team/${myTeam.id}`,
                type: "team" as ChatType,
                setDirty: setDirtyTeams,
                dirty: dirtyTeams,
            });
        }

        setChats(newChats);
    }, [myTeam, dirtyGlobal, setDirtyGlobal, dirtyTeams, setDirtyTeams]);


    return (
        <Page padding={false}>
            <ChatTabs chats={chats} openChat={openChat} setOpenChat={setOpenChat} />
            <div className="relative bg-neutral-950 w-full h-full rounded-b-md flex flex-col">
                {openChat ? <ChatWindow
                    messages={displayChats}
                    pendingMessages={pendingChats}
                    canLoadMore={openChat === "global" ? canLoadMoreGlobal : canLoadMoreTeam}
                    openChat={openChat!}
                />
                    :
                    <div className="w-full flex-1 flex items-center justify-center flex-col gap-5">
                        <HiMiniChatBubbleBottomCenterText size={128} color={"#171717"} />
                        <span className="text-neutral-500 w-1/2 text-center">
                            Select a chat from the above list to start messaging!
                        </span>
                    </div>}
                <MessageInput
                    value={currMessage}
                    onChange={setCurrMessage}
                    sendMessage={sendMessage}
                    disabled={!openChat}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder={openChat ? `Message ${openChat} chat as ${me?.name}` : "Select a channel to message"}
                />
            </div>
        </Page>
    )
}


export default MessagesPage;