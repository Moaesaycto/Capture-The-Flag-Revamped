import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createWebSocket } from "../../services/api";
import { useAuthContext } from "./AuthContext";
import { getTeamMessages, teamMessage } from "../../services/TeamApi";
import type { ChatMessage, ChatType, MessageResponse } from "../../types";
import { getGlobalMessages, globalMessage } from "../../services/GameApi";

interface MessageContextValue {
    openChat: ChatType | null,
    setOpenChat: (chat: ChatType | null) => void;
    sendMessage: (message: string) => Promise<MessageResponse>;
    dirtyTeams: boolean;
    setDirtyTeams: (dirty: boolean) => void;
    dirtyGlobal: boolean;
    setDirtyGlobal: (dirty: boolean) => void;
    globalChats: ChatMessage[],
    teamChats: ChatMessage[],
    pendingTeamMessages: ChatMessage[],
    pendingGlobalMessages: ChatMessage[],
    restoreOpen: () => void,
    loadingGlobalChats: boolean,
    loadingTeamChats: boolean,
    chatError: string | null,
    canLoadMoreGlobal: boolean,
    canLoadMoreTeam: boolean,
    displayChats: ChatMessage[],
    pendingChats: ChatMessage[],
    isOpenChatLoading: boolean,
    setOpenChatDirty: (dirty: boolean) => void;
    getMoreMessagesOpenChat: (start: number) => void;
    isLoadingMore: boolean;
    firstItemIndex: number;
}

const INITIAL_FIRST_INDEX = 100_000


const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const { jwt, myTeam, me } = useAuthContext();

    const [openChat, setOpenChat] = useState<ChatType | null>(null);
    const [lastOpenChat, setLastOpenChat] = useState<ChatType | null>(null);
    const [firstItemIndex, setFirstItemIndex] = useState(INITIAL_FIRST_INDEX);

    // Global chat params
    const [globalChats, setGlobalChats] = useState<ChatMessage[]>([]);
    const [dirtyGlobal, setDirtyGlobal] = useState<boolean>(false);
    const [loadingGlobalChats, setLoadingGlobalChats] = useState<boolean>(true);
    const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
    const [canLoadMoreGlobal, setCanLoadMoreGlobal] = useState<boolean>(false);
    const [isLoadingMoreGlobal, setIsLoadingMoreGlobal] = useState<boolean>(false);

    // Team chat params
    const [teamChats, setTeamChats] = useState<ChatMessage[]>([]);
    const [dirtyTeams, setDirtyTeams] = useState<boolean>(false);
    const [loadingTeamChats, setLoadingTeamChats] = useState<boolean>(true);
    const [errorTeam, setErrorTeam] = useState<string | null>(null);
    const [canLoadMoreTeam, setCanLoadMoreTeam] = useState<boolean>(false);
    const [isLoadingMoreTeam, setIsLoadingMoreTeam] = useState<boolean>(false);

    const [pendingTeamMessages, setPendingTeamMessages] = useState<ChatMessage[]>([]);
    const [pendingGlobalMessages, setPendingGlobalMessages] = useState<ChatMessage[]>([]);

    const wsGlobalRef = useRef<WebSocket | null>(null);
    const wsTeamRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!myTeam) return;
        getGlobalMessages(2147483647, 20, jwt!)
            .then((e) => {
                setGlobalChats(e.messages);
                setCanLoadMoreGlobal(!e.end);
            })
            .catch((e) => setErrorGlobal(e.message))

        getTeamMessages(2147483647, 20, myTeam?.id!, jwt!)
            .then((e) => {
                setTeamChats(e.messages);
                setCanLoadMoreTeam(!e.end);
            })
            .catch((e) => setErrorTeam(e.message))
    }, [myTeam]);

    useEffect(() => {
        const wsGlobal = createWebSocket(
            "global",
            jwt ?? undefined,
            (m: string) => {
                const msg: ChatMessage = JSON.parse(m);
                setPendingGlobalMessages(prev => prev.filter(p =>
                    !(
                        (p as any).serverId === msg.messageId ||
                        (p.player?.id === msg.player?.id && p.message === msg.message)
                    )
                ));
                setGlobalChats(prev => [...prev, msg]);
                if (msg.player?.id !== me?.id) setDirtyGlobal(openChat !== "global");
            },
            () => setLoadingGlobalChats(false)
        );
        wsGlobalRef.current = wsGlobal;

        let wsTeam = null;
        if (myTeam) {
            wsTeam = createWebSocket(
                `team/${myTeam?.id}`,
                jwt ?? undefined,
                (m: string) => {
                    const msg: ChatMessage = JSON.parse(m);
                    setPendingTeamMessages(prev => prev.filter(p =>
                        !(
                            (p as any).serverId === msg.messageId ||
                            (p.player?.id === msg.player?.id && p.message === msg.message)
                        )
                    ));
                    setTeamChats(prev => [...prev, msg]);
                    if (msg.player?.id !== me?.id) setDirtyTeams(openChat !== "team");
                },
                () => setLoadingTeamChats(false)
            );
            wsTeamRef.current = wsTeam;
        }

        return () => {
            wsGlobal.close();
            wsTeam && wsTeam.close();
            wsGlobalRef.current = null;
            wsTeamRef.current = null;
        }
    }, [jwt, myTeam]);


    const sendMessage = useCallback(async (message: string): Promise<MessageResponse> => {
        if (!jwt) return Promise.reject(new Error("No JWT detected"));

        if (!openChat) return Promise.reject(new Error("No chat selected"));

        const tempId = Date.now();
        const tempMsg: ChatMessage = {
            messageId: tempId,
            clientId: tempId,
            message,
            player: me!,
            team: myTeam?.id || "",
            time: Date.now(),
            serverId: undefined,
        }

        let promise: Promise<MessageResponse>;
        switch (openChat) {
            case "team":
                setPendingTeamMessages(prev => [...prev, tempMsg]);
                if (!myTeam?.id) {
                    setPendingTeamMessages(prev => prev.filter(p => p.clientId !== tempId));
                    return Promise.reject(new Error("No team selected"));
                }
                promise = teamMessage(message, myTeam.id, jwt);
                break;
            case "global":
                setPendingGlobalMessages(prev => [...prev, tempMsg]);
                promise = globalMessage(message, jwt);
                break;
            default:
                return Promise.reject(new Error("Unknown chat type"));
        }

        try {
            const res = await promise;
            switch (openChat) {
                case "team":
                    setPendingTeamMessages(prev =>
                        prev.filter(p => p.clientId !== tempId)
                    );
                    break;
                case "global":
                    setPendingGlobalMessages(prev =>
                        prev.filter(p => p.clientId !== tempId)
                    );
                    break;
            }

            return res;
        } catch (err) {
            switch (openChat) {
                case "team":
                    setPendingTeamMessages(prev => prev.filter(p => p.clientId !== tempId));
                    break;
                case "global":
                    setPendingGlobalMessages(prev => prev.filter(p => p.clientId !== tempId));
                    break;
            }
            throw err;
        }

    }, [jwt, openChat, me, myTeam]);

    useEffect(() => {
        if (openChat) setLastOpenChat(openChat);
    }, [openChat]);

    const restoreOpen = useCallback(() => {
        if (lastOpenChat) {
            setOpenChat(lastOpenChat)
            switch (lastOpenChat) {
                case "global":
                    setDirtyGlobal(false);
                    break;
                case "team":
                    setDirtyTeams(false);
                    break;
            }
        };
    }, [lastOpenChat]);

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

    const isOpenChatLoading = useMemo<boolean>(() => {
        switch (openChat) {
            case "global": return loadingGlobalChats;
            case "team": return loadingTeamChats;
            default: return false;
        }
    }, [openChat, loadingGlobalChats, loadingTeamChats]);

    const setOpenChatDirty = useCallback((dirty: boolean) => {
        switch (openChat) {
            case "global": return setDirtyGlobal(dirty);
            case "team": return setDirtyTeams(dirty);
        }
    }, [openChat, setDirtyGlobal, setDirtyTeams]);

    const chatError = useMemo<string | null>(() => {
        switch (openChat) {
            case "global": return errorGlobal;
            case "team": return errorTeam;
            default: return null;
        }
    }, [openChat, errorTeam, errorGlobal]);

    const isLoadingMore = useMemo<boolean>(() => {
        switch (openChat) {
            case "global": return isLoadingMoreGlobal;
            case "team": return isLoadingMoreTeam;
            default: return false;
        }
    }, [openChat, isLoadingMoreGlobal, isLoadingMoreTeam]);

    const getMoreMessagesOpenChat = useCallback((start: number) => {
        if (!jwt) return;

        switch (openChat) {
            case "global":
                if (isLoadingMoreGlobal) return; // Prevent duplicate calls
                setIsLoadingMoreGlobal(true);
                getGlobalMessages(start, 20, jwt!).then((res) => {
                    setCanLoadMoreGlobal(!res.end);

                    // Update firstItemIndex BEFORE updating messages
                    setFirstItemIndex(prevIndex => prevIndex - res.messages.length);

                    // Then update messages
                    setGlobalChats(prev => [...res.messages, ...prev]);
                }).finally(() => setIsLoadingMoreGlobal(false));
                break;

            case "team":
                if (!myTeam) return;
                if (isLoadingMoreTeam) return; // Prevent duplicate calls
                setIsLoadingMoreTeam(true);
                getTeamMessages(start, 20, myTeam.id, jwt!).then((res) => {
                    setCanLoadMoreTeam(!res.end);

                    // Update firstItemIndex BEFORE updating messages
                    setFirstItemIndex(prevIndex => prevIndex - res.messages.length);

                    // Then update messages
                    setTeamChats(prev => [...res.messages, ...prev]);
                }).finally(() => setIsLoadingMoreTeam(false));
                break;

            default: return;
        }
    }, [jwt, openChat, myTeam, isLoadingMoreGlobal, isLoadingMoreTeam]);



    const providerValue = useMemo(() => ({
        openChat,
        setOpenChat,
        sendMessage,
        dirtyTeams,
        setDirtyTeams,
        dirtyGlobal,
        setDirtyGlobal,
        globalChats,
        teamChats,
        pendingTeamMessages,
        pendingGlobalMessages,
        restoreOpen,
        loadingGlobalChats,
        loadingTeamChats,
        canLoadMoreGlobal,
        canLoadMoreTeam,
        displayChats,
        pendingChats,
        isOpenChatLoading,
        setOpenChatDirty,
        chatError,
        getMoreMessagesOpenChat,
        isLoadingMore,
        firstItemIndex,
    }), [
        openChat, sendMessage, dirtyTeams, dirtyGlobal, globalChats, teamChats,
        pendingTeamMessages, pendingGlobalMessages, loadingGlobalChats, loadingTeamChats,
        canLoadMoreGlobal, canLoadMoreTeam, displayChats, pendingChats, isOpenChatLoading,
        chatError, getMoreMessagesOpenChat, firstItemIndex,
    ]);
    return (
        <MessageContext.Provider value={providerValue}>
            {children}
        </MessageContext.Provider>

    )
}

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) throw new Error("useMessageContext must be used within a MessageProvider")
    return context;
}

export default MessageContext;