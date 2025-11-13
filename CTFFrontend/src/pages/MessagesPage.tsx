import Page from "../components/main/Page";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiGlobeBold } from "react-icons/pi";
import type { IconType } from "react-icons";
import { FaFlag } from "react-icons/fa6";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaPaperPlane } from "react-icons/fa";
import { useGameContext } from "../components/contexts/GameContext";
import Color from "color";
import { useMessageContext, type ChatType } from "../components/contexts/MessageContext";
import type { ChatMessage } from "../types";
import Spinner from "../components/main/LoadingSpinner";
import { BiCheck, BiChevronDown, BiSolidStar } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";

type Chat = {
    icon: IconType,
    title: string,
    path: string,
    type: ChatType,
    dirty: boolean,
    setDirty: (dirty: boolean) => void
}

const MAX_MESSAGE_LENGTH = import.meta.env.VITE_MAX_MESSAGE_LENGTH ?? 256;

const Message = ({ message, pending }: { message: ChatMessage, pending?: boolean }) => {
    const { me } = useAuthContext();
    const { getTeamFromId } = useGameContext();

    const isMe = me?.id === message.player.id;
    const teamColor = getTeamFromId(message.team)?.color ?? "#ffffff"

    return <li
        className={`py-2 pl-4 pr-2 rounded-2xl flex flex-col bg-neutral-800
            ${isMe ? "ml-[20%] rounded-br-sm" : "mr-10 rounded-bl-sm"}
            `}
        style={{
            opacity: pending ? 0.2 : 1
        }}
    >
        <div
            className="flex justify-between h-4 text-xs"
            style={{ color: Color(teamColor).lighten(0.25).toString() }}
        >
            <div className="flex flex-row gap-1.5 items-center">
                {message.player.id === me?.id ? <BiSolidStar style={{ color: "gold" }} /> : null}
                <span>
                    {message.player.name}
                </span>
                {message.player.auth ? <RiAdminFill style={{ color: "#FFB900" }} /> : null}
                <span className="text-neutral-400">
                    {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            <div>
                {pending ?
                    <span>
                        <Spinner size={20} />
                    </span> :
                    <span>
                        <BiCheck size={20} />
                    </span>
                }
            </div>
        </div>
        <span>
            {message.message}
        </span>
        <div className="">

        </div>
    </li>
}

const MessagesPage = () => {
    const { loggedIn, me, myTeam } = useAuthContext();
    const {
        sendMessage,
        openChat,
        setOpenChat,
        globalChats,
        teamChats,
        dirtyGlobal,
        setDirtyGlobal,
        dirtyTeams,
        setDirtyTeams,
        pendingTeamMessages,
        pendingGlobalMessages,
        restoreOpen,
    } = useMessageContext();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLUListElement>(null);
    const latestIsAtBottomRef = useRef<boolean>(true);
    const prevMessagesCountRef = useRef<number>(0);

    const [chats, setChats] = useState<Chat[]>([]);
    const [currMessage, setCurrMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newMessageAlert, setNewMessageAlert] = useState<boolean>(false);

    const canSend = useMemo<boolean>(() => {
        const message = currMessage.trim();
        const rightState = !!openChat;
        const textOk = message.length > 0 && message.length <= MAX_MESSAGE_LENGTH;
        return !loading && rightState && textOk;

    }, [openChat, currMessage, loading]);

    const displayChats = useMemo<ChatMessage[]>(() => {
        switch (openChat) {
            case "global": return globalChats;
            case "team": return teamChats;
            default: return [];
        }
    }, [openChat, globalChats, teamChats]);

    const pendingChats = useMemo<ChatMessage[]>(() => {
        switch (openChat) {
            case "global": return pendingGlobalMessages;
            case "team": return pendingTeamMessages;
            default: return [];
        }
    }, [openChat, pendingGlobalMessages, pendingTeamMessages]);

    const onSubmit = useCallback(() => {
        setLoading(true);
        setError(null);
        sendMessage(currMessage)
            .then(() => {
                setCurrMessage("");
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            })
            .catch(e => setError(e?.message ?? e))
            .finally(() => {
                setLoading(false);
            });
    }, [sendMessage, currMessage]);

    // Returning to last viewed page
    useEffect(() => {
        restoreOpen();
    }, []);

    useEffect(() => {
        return () => {
            setOpenChat(null);
        };
    }, [setOpenChat]);

    // TODO: Maybe remove this, I do not think it is
    useEffect(() => {
        if (!loggedIn) navigate("/");
    }, [loggedIn, navigate])

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
    }, [myTeam, openChat, setOpenChat, globalChats, teamChats, dirtyGlobal, setDirtyGlobal, dirtyTeams, setDirtyTeams]);

    // Reset to focus on input after sent
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currMessage]);

    // Scroll to the bottom
    useEffect(() => {
        const total = displayChats.length + pendingChats.length;
        if (total === prevMessagesCountRef.current) return;

        const container = messageContainerRef.current;
        const tolerance = 10;
        const atBottomLive = !!container && (container.scrollHeight - container.scrollTop <= container.clientHeight + tolerance);

        const lastPending = pendingChats.length ? pendingChats[pendingChats.length - 1] : null;
        const lastDisplayed = displayChats.length ? displayChats[displayChats.length - 1] : null;
        const last = lastPending ?? lastDisplayed;
        const isFromMe = !!last && last.player?.id === me?.id;

        if (isFromMe || latestIsAtBottomRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setNewMessageAlert(false);
        } else if (atBottomLive) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setNewMessageAlert(false);
        } else {
            setNewMessageAlert(true);
        }

        prevMessagesCountRef.current = total;
    }, [displayChats, pendingChats, me]);


    // Event listener for new messages
    useEffect(() => {
        const container = messageContainerRef.current;
        if (!container) return;

        const tolerance = 4; // px
        const onScroll = () => {
            const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - tolerance;

            latestIsAtBottomRef.current = atBottom;

            if (atBottom) {
                // manually scrolled to the bottom
                setNewMessageAlert(false);
                prevMessagesCountRef.current = displayChats.length + pendingChats.length;
            }
        };

        container.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return () => container.removeEventListener("scroll", onScroll);
    }, [openChat, displayChats.length, pendingChats.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setNewMessageAlert(false);
    }, [openChat]);

    return (
        <Page>
            <div className="bg-amber-400 h-8 w-full rounded-t-md flex flex-row items-center justify-around text-black text-lg gap-2 px-1">
                {chats.map((c, k) =>
                    <li
                        className={`list-none flex items-center gap-2 h-6 justify-center rounded-md flex-1 hover:cursor-pointer
                            ${openChat == c.type ? "bg-amber-500 hover:bg-orange-400 shadow-xl" : "hover:bg-amber-300 "}
                            `}
                        onClick={() => {
                            setOpenChat(c.type);
                            c.setDirty(false);
                        }}
                        key={k}
                    >
                        {c.dirty && <div className="w-3 h-3 bg-red-500 border-red-900 rounded-full -top-1.5 -left-1.5" />}
                        <c.icon />
                        <span>{c.title}</span>
                    </li>
                )}
            </div>
            <div className="relative bg-neutral-950 w-full h-full rounded-b-md flex flex-col">
                {openChat ? (
                    displayChats.length + pendingChats.length === 0 ?
                        <div className="w-full flex-1 flex items-center justify-center flex-col gap-5">
                            {openChat === "global" ? <PiGlobeBold size={128} color={"#171717"} /> : <FaFlag size={128} color={"#171717"} />}
                            <span className="text-neutral-500 w-1/2 text-center">
                                Nobody has messaged in {openChat} chat
                            </span>
                        </div> :
                        <ul
                            ref={messageContainerRef}
                            className="flex-1 p-5 flex flex-col gap-4 overflow-y-scroll grow shrink basis-0 custom-scroll"
                        >
                            {displayChats.map((m) => <Message message={m} key={`msg-${m.messageId}`} />)}
                            {pendingChats.map((m) => <Message message={m} key={`pending-${m.clientId}`} pending />)}
                            <div ref={messagesEndRef} />
                        </ul>
                )
                    :
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
                    {error &&
                        <div className="text-xs px-4 h-2 text-red-800">
                            {error}
                        </div>
                    }
                    <div
                        className="relative py-4 px-4 flex flex-row gap-4 items-center"
                    >
                        {newMessageAlert && (
                            <div
                                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-700 hover:bg-red-600 shadow-2xl text-center px-5 py-1
                                rounded-full cursor-pointer flex flex-row items-center gap-1"
                                onClick={() => {
                                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                                    setNewMessageAlert(false);
                                    latestIsAtBottomRef.current = true;
                                    prevMessagesCountRef.current = displayChats.length + pendingChats.length;
                                }}
                            >
                                <span>
                                    New Messages
                                </span>
                                <BiChevronDown size={20} />
                            </div>
                        )}
                        <input
                            ref={inputRef}
                            className={`bg-neutral-900 w-full py-1 px-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none
                            disabled:hover:cursor-not-allowed disabled:opacity-50`}
                            value={currMessage}
                            placeholder={`Message as ${me?.name}`}
                            disabled={!openChat || loading}
                            onChange={(e) => setCurrMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !canSend) return;
                                if (e.key === "Enter") onSubmit();
                            }}
                        />
                        <button
                            className={`bg-amber-400 text-black w-10 h-7.5 rounded flex justify-center items-center
                            hover:bg-amber-500 hover:cursor-pointer disabled:hover:cursor-not-allowed
                            disabled:hover:bg-amber-400 disabled:opacity-50`}
                            disabled={!canSend}
                            onClick={onSubmit}
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