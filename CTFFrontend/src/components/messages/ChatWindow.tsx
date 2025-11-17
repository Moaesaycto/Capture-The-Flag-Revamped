import { PiGlobeBold, PiWifiXBold } from "react-icons/pi";
import type { ChatMessage } from "@/types";
import { FaFlag } from "react-icons/fa";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useGameContext } from "@/components/contexts/GameContext";
import Color from "color";
import { BiCheck, BiChevronDown, BiSolidStar } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import Spinner from "@/components/main/LoadingSpinner";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMessageContext } from "@/components/contexts/MessageContext";
import { Virtuoso } from 'react-virtuoso'

const MessageInner = ({ message, pending }: { message: ChatMessage, pending?: boolean }) => {
    const { me } = useAuthContext();
    const { getTeamFromId } = useGameContext();

    const isMe = me?.id === message.player.id;
    const teamColor = getTeamFromId(message.team)?.color ?? "#ffffff";

    const lightColor = useMemo(() => Color(teamColor).lighten(0.25).toString(), [teamColor]);
    const formattedTime = useMemo(
        () => new Date(message.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        [message.time]
    );
    const containerStyle = useMemo(() => ({ opacity: pending ? 0.2 : 1 }), [pending]);
    const headerStyle = useMemo(() => ({ color: lightColor }), [lightColor]);

    return (
        <div className="py-2 px-10">
            <li
                className={`py-2 pl-4 pr-2 rounded-2xl flex flex-col bg-neutral-800
        ${isMe ? "ml-[20%] rounded-br-xs" : "mr-[20%] rounded-bl-xs"}`}
                style={containerStyle}
            >
                <div className="flex justify-between h-4 text-xs" style={headerStyle}>
                    <div className="flex flex-row gap-1.5 items-center">
                        {message.player.id === me?.id ? <BiSolidStar style={{ color: "gold" }} /> : null}
                        <span>{message.player.name}</span>
                        {message.player.auth ? <RiAdminFill style={{ color: "#FFB900" }} /> : null}
                        <span className="text-neutral-400">{formattedTime}</span>
                    </div>
                    <div>{pending ? <Spinner size={20} /> : <BiCheck size={20} />}</div>
                </div>
                <span>{message.message}</span>
            </li>
        </div>
    );
};

const Message = React.memo(MessageInner, (prev, next) => {
    return (
        prev.pending === next.pending &&
        prev.message.messageId === next.message.messageId &&
        prev.message.clientId === next.message.clientId &&
        prev.message.message === next.message.message &&
        prev.message.time === next.message.time &&
        prev.message.player?.id === next.message.player?.id &&
        prev.message.team === next.message.team
    );
});

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
    const { setOpenChatDirty, isOpenChatLoading, chatError, getMoreMessagesOpenChat, firstItemIndex } = useMessageContext();

    const [newMessageAlert, setNewMessageAlert] = useState<boolean>(false);

    const latestIsAtBottomRef = useRef<boolean>(true);
    const prevMessagesCountRef = useRef<number>(0);
    const prevLastMessageIdRef = useRef<number | null>(null);
    const virtuosoRef = useRef<any>(null);
    const isLoadingMoreRef = useRef<boolean>(false);

    const totalMessages = messages.length + pendingMessages.length;

    // Sorted list of messages
    const allSorted = useMemo(() => {
        const visible = messages.map(m => ({ ...m, __pending: false }));
        const pending = pendingMessages.map(m => ({ ...m, __pending: true }));

        const merged = [...visible, ...pending].filter((v, i, arr) =>
            arr.findIndex(x => x.messageId === v.messageId && x.clientId === v.clientId) === i
        );

        merged.sort((a, b) => (a.serverId ?? a.messageId) - (b.serverId ?? b.messageId));
        return merged;
    }, [messages, pendingMessages]);

    const scrollToBottom = useCallback(() => {
        virtuosoRef.current?.scrollToIndex({
            index: 'LAST',
            align: 'end',
            behavior: 'smooth',
        });
    }, []);


    // Handle logic for scrolling and notifying when new messages come in
    useEffect(() => {
        const total = allSorted.length;
        if (total === prevMessagesCountRef.current) return;

        const last = allSorted.length ? allSorted[allSorted.length - 1] : null;
        const lastId = last?.messageId ?? null;

        const prevLastId = prevLastMessageIdRef.current;

        if (isLoadingMoreRef.current) {
            isLoadingMoreRef.current = false;
            prevMessagesCountRef.current = total;
            prevLastMessageIdRef.current = lastId;
            return;
        }

        if (prevLastId !== null && lastId === prevLastId) {
            prevMessagesCountRef.current = total;
            return;
        }

        const isFromMe = !!last && last.player?.id === me?.id;

        if (isFromMe || latestIsAtBottomRef.current) {
            requestAnimationFrame(scrollToBottom);
            setNewMessageAlert(false);
            setOpenChatDirty(false);
        } else {
            setNewMessageAlert(true);
        }

        prevMessagesCountRef.current = total;
        prevLastMessageIdRef.current = lastId;
    }, [allSorted, me, scrollToBottom, setOpenChatDirty]);

    if (chatError) {
        return (
            <div className="w-full flex-1 flex items-center justify-center flex-col gap-5">
                <PiWifiXBold size={128} className="text-red-500 mb-4 opacity-30" />
                <span className="text-neutral-500 w-1/2 text-center">
                    Cannot connect to {openChat} message server...
                </span>
            </div>
        )
    }

    if (isOpenChatLoading) {
        return (
            <div className="w-full flex-1 flex items-center justify-center flex-col gap-5">
                <Spinner size={128} />
                <span className="text-neutral-500 w-1/2 text-center">
                    Retrieving {openChat} chats...
                </span>
            </div>
        );
    }

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

    const initialIndex = firstItemIndex + allSorted.length - 1;

    return (
        <div className="relative flex-1 flex flex-col">
            <Virtuoso
                key={openChat}
                ref={virtuosoRef}
                data={allSorted}
                firstItemIndex={firstItemIndex}
                initialTopMostItemIndex={initialIndex}
                increaseViewportBy={200}
                startReached={() => {
                    isLoadingMoreRef.current = true;
                    getMoreMessagesOpenChat(allSorted[0].messageId - 1);
                }}
                itemContent={(index, m) => <Message
                    message={m}
                    key={m.__pending ? `pending-${m.clientId}-${index}` : `msg-${m.messageId}-${index}`}
                    pending={m.__pending}
                />}
                components={{
                    Header: () => (
                        <div className="p-2 pt-4">
                            <div className="w-full bg-neutral-900 rounded-full py-0.5 flex justify-center items-center gap-2">
                                {canLoadMore ? (
                                    <>
                                        <Spinner size={16} />
                                        <span>Loading chats...</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-neutral-600">Beginning of the chat</span>
                                )}
                            </div>
                        </div>
                    )
                }}
                followOutput={latestIsAtBottomRef.current ? 'smooth' : false}
                atBottomStateChange={(atBottom) => {
                    latestIsAtBottomRef.current = atBottom;
                    if (atBottom) {
                        setNewMessageAlert(false);
                        setOpenChatDirty(false);
                    }
                }}
            />
            {
                newMessageAlert && (
                    <div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-red-700 hover:bg-red-600 shadow-2xl text-center px-5 py-1
                   rounded-full cursor-pointer flex flex-row items-center gap-1"
                        onClick={() => {
                            scrollToBottom();
                            latestIsAtBottomRef.current = true;
                            setNewMessageAlert(false);
                            setOpenChatDirty(false);
                        }}
                    >
                        <span>New Messages</span>
                        <BiChevronDown size={20} />
                    </div>
                )
            }
        </div>
    );
};