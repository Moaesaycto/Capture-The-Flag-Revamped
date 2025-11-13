import { PiGlobeBold } from "react-icons/pi";
import type { ChatMessage } from "../../types";
import { FaFlag } from "react-icons/fa";
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import Color from "color";
import { BiCheck, BiChevronDown, BiSolidStar } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import Spinner from "../main/LoadingSpinner";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMessageContext } from "../contexts/MessageContext";

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


interface ChatWindowProps {
    messages: ChatMessage[];
    pendingMessages: ChatMessage[];
    canLoadMore: boolean;
    openChat: "global" | "team";
}

export const ChatWindow = ({
    messages,
    pendingMessages,
    canLoadMore,
    openChat
}: ChatWindowProps) => {
    const { me } = useAuthContext();
    const { setDirtyTeams, setDirtyGlobal } = useMessageContext();

    const [newMessageAlert, setNewMessageAlert] = useState<boolean>(false);

    const containerRef = useRef<HTMLUListElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const latestIsAtBottomRef = useRef<boolean>(true);
    const prevMessagesCountRef = useRef<number>(0);

    const totalMessages = messages.length + pendingMessages.length;

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => a.messageId - b.messageId);
    }, [messages]);

    const sortedPending = useMemo(() => {
        return [...pendingMessages].sort((a, b) => a.messageId - b.messageId);
    }, [pendingMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        const total = messages.length + pendingMessages.length;
        if (total === prevMessagesCountRef.current) return;

        const lastPending = pendingMessages.length ? pendingMessages[pendingMessages.length - 1] : null;
        const lastDisplayed = messages.length ? messages[messages.length - 1] : null;
        const last = lastPending ?? lastDisplayed;
        const isFromMe = !!last && last.player?.id === me?.id;

        if (isFromMe || latestIsAtBottomRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setNewMessageAlert(false);
        } else {
            // User scrolled up, do not scroll
            setNewMessageAlert(true);
        }

        prevMessagesCountRef.current = total;
    }, [messages, pendingMessages, me]);

    // Track manual scroll to update latestIsAtBottomRef
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const tolerance = 4;
        const onScroll = () => {
            const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - tolerance;
            latestIsAtBottomRef.current = atBottom;

            // If user scrolls to bottom, hide new message alert
            if (atBottom && newMessageAlert) {
                setNewMessageAlert(false);
            }
        };

        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, [newMessageAlert]);

    // Handler for clicking "New Messages" badge
    const handleNewMessageAlertClick = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        latestIsAtBottomRef.current = true;
        prevMessagesCountRef.current = messages.length + pendingMessages.length;
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setNewMessageAlert(false);
    }, [openChat]);

    useEffect(() => {
        switch (openChat) {
            case "team":
                setDirtyTeams(newMessageAlert);
                break;
            case "global":
                setDirtyGlobal(newMessageAlert);
                break;
        }
    }, [newMessageAlert]);


    if (totalMessages === 0) {
        return (
            <div className="w-full flex-1 flex items-center justify-center flex-col gap-5">
                {openChat === "global" ? (
                    <PiGlobeBold size={128} color="#171717" />
                ) : (
                    <FaFlag size={128} color="#171717" />
                )}
                <span className="text-neutral-500 w-1/2 text-center">
                    Nobody has messaged in {openChat} chat
                </span>
            </div>
        );
    }

    return (
        <div className="relative flex-1 flex flex-col">
            <ul
                ref={containerRef}
                className="flex-1 p-5 flex flex-col gap-4 overflow-y-scroll grow shrink basis-0 custom-scroll"
            >
                {canLoadMore && <button>Load more</button>}
                {sortedMessages.map((m) => (
                    <Message message={m} key={`msg-${m.messageId}`} />
                ))}
                {sortedPending.map((m) => (
                    <Message message={m} key={`pending-${m.clientId}`} pending />
                ))}
                <div ref={messagesEndRef} />
            </ul>

            {newMessageAlert && (
                <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-red-700 hover:bg-red-600 shadow-2xl text-center px-5 py-1
                       rounded-full cursor-pointer flex flex-row items-center gap-1"
                    onClick={handleNewMessageAlertClick}
                >
                    <span>New Messages</span>
                    <BiChevronDown size={20} />
                </div>
            )}
        </div>

    );
};
