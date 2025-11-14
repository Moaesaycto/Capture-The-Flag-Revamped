import { PiGlobeBold, PiWifiXBold } from "react-icons/pi";
import type { ChatMessage } from "../../types";
import { FaFlag } from "react-icons/fa";
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import Color from "color";
import { BiCheck, BiChevronDown, BiSolidStar } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import Spinner from "../main/LoadingSpinner";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMessageContext } from "../contexts/MessageContext";


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
        <li
            className={`py-2 pl-4 pr-2 rounded-2xl flex flex-col bg-neutral-800
        ${isMe ? "ml-[20%] rounded-br-sm" : "mr-10 rounded-bl-sm"}`}
            style={containerStyle}
        >
            <div className="flex justify-between h-4 text-xs" style={headerStyle}>
                <div className="flex flex-row gap-1.5 items-center">
                    {message.player.id === me?.id ? <BiSolidStar style={{ color: "gold" }} /> : null}
                    <span>{message.player.name}</span>
                    {message.player.auth ? <RiAdminFill style={{ color: "#FFB900" }} /> : null}
                    <span className="text-neutral-400">{formattedTime}</span>
                    <span className="text-neutral-400">{message.messageId}</span>
                </div>
                <div>{pending ? <Spinner size={20} /> : <BiCheck size={20} />}</div>
            </div>
            <span>{message.message}</span>
        </li>
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
    const { setOpenChatDirty, isOpenChatLoading, chatError, getMoreMessagesOpenChat, isLoadingMore } = useMessageContext();

    const [newMessageAlert, setNewMessageAlert] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const latestIsAtBottomRef = useRef<boolean>(true);
    const prevMessagesCountRef = useRef<number>(0);
    const prevLastMessageIdRef = useRef<number | null>(null);
    const isLoadingMoreRef = useRef(false);
    const isScrollbarDraggingRef = useRef(false);
    const pendingLoadRef = useRef(false);

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


    // Handle logic for scrolling and notifying when new messages come in
    useEffect(() => {
        const total = allSorted.length;
        if (total === prevMessagesCountRef.current) return;

        const last = allSorted.length ? allSorted[allSorted.length - 1] : null;
        const lastId = last?.messageId ?? null;

        const prevLastId = prevLastMessageIdRef.current;
        if (prevLastId !== null && lastId === prevLastId) {
            prevMessagesCountRef.current = total;
            return;
        }

        const isFromMe = !!last && last.player?.id === me?.id;

        if (isFromMe || latestIsAtBottomRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setNewMessageAlert(false);
            setOpenChatDirty(false);
        } else {
            // No scrolling
            setNewMessageAlert(true);
        }

        prevMessagesCountRef.current = total;
        prevLastMessageIdRef.current = lastId;
    }, [allSorted, me]);

    // The infinite scroll logic
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const bottomTolerance = 4;

        // Track scrollbar dragging
        const onMouseDown = (e: MouseEvent) => {
            // If the user clicked on the scrollbar (thumb or background)
            const target = e.target as HTMLElement;
            if (target === container) {
                const rect = container.getBoundingClientRect();
                const clickX = e.clientX;
                if (clickX > rect.right - 20) {
                    // Freeze infinite load
                    isScrollbarDraggingRef.current = true;
                }
            }
        };

        const onMouseUp = () => {
            if (isScrollbarDraggingRef.current) {
                isScrollbarDraggingRef.current = false;
                // Check if we should load more now that dragging is done
                if (pendingLoadRef.current) {
                    pendingLoadRef.current = false;
                    triggerLoad();
                }
            }
        };

        const triggerLoad = () => {
            if (isLoadingMoreRef.current || !canLoadMore || isLoadingMore || allSorted.length === 0) {
                return;
            }

            isLoadingMoreRef.current = true;

            const oldScrollHeight = container.scrollHeight;
            const oldScrollTop = container.scrollTop;

            getMoreMessagesOpenChat(allSorted[0].messageId - 1);

            const checkAndAdjust = () => {
                if (container.scrollHeight === oldScrollHeight) {
                    requestAnimationFrame(checkAndAdjust);
                } else {
                    const scrollDiff = container.scrollHeight - oldScrollHeight;
                    container.scrollTop = oldScrollTop + scrollDiff;
                    isLoadingMoreRef.current = false;
                }
            };

            requestAnimationFrame(checkAndAdjust);
        };

        const onScroll = () => {
            const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - bottomTolerance;

            latestIsAtBottomRef.current = atBottom;
            if (atBottom) {
                setNewMessageAlert(false);
                setOpenChatDirty(false);
            }

            // Check if scrolled near top (for loading more messages)
            const threshold = 500;
            if (container.scrollTop < threshold) {
                if (isScrollbarDraggingRef.current) {
                    // Mark that we want to load, but wait for mouse release
                    pendingLoadRef.current = true;
                } else {
                    // Not dragging, load immediately
                    triggerLoad();
                }
            }
        };

        container.addEventListener("scroll", onScroll, { passive: true });
        container.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            container.removeEventListener("scroll", onScroll);
            container.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, [allSorted, canLoadMore, isLoadingMore, getMoreMessagesOpenChat, setOpenChatDirty]);

    // When opened, scroll to the bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
        setNewMessageAlert(false);
    }, [openChat]);

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

    return (
        <div className="relative flex-1 flex flex-col">
            <div
                id="scrollableDiv"
                ref={containerRef}
                className="flex-1 px-5 pt-5 overflow-y-auto custom-scroll grow shrink basis-0"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {isLoadingMore && (
                        <div className="w-full bg-neutral-900 rounded-full py-0.5 flex justify-center items-center gap-2">
                            <Spinner size={16} />
                            <span>Loading more...</span>
                        </div>
                    )}
                    {allSorted.map((m) => (
                        <Message
                            message={m}
                            key={m.__pending ? `pending-${m.clientId}` : `msg-${m.messageId}`}
                            pending={m.__pending}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {
                newMessageAlert && (
                    <div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-red-700 hover:bg-red-600 shadow-2xl text-center px-5 py-1
                   rounded-full cursor-pointer flex flex-row items-center gap-1"
                        onClick={() => {
                            requestAnimationFrame(() => {
                                messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                                latestIsAtBottomRef.current = true;
                                setNewMessageAlert(false);
                                setOpenChatDirty(false);
                                prevMessagesCountRef.current = messages.length + pendingMessages.length;
                            })
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
