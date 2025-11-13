import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createWebSocket } from "../../services/api";
import { useAuthContext } from "./AuthContext";
import { teamMessage } from "../../services/TeamApi";
import type { ChatMessage, MessageResponse } from "../../types";
import { globalMessage } from "../../services/GameApi";

export type ChatType = "global" | "team";

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
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const { jwt, myTeam, me } = useAuthContext();

    const [openChat, setOpenChat] = useState<ChatType | null>(null);
    const [lastOpenChat, setLastOpenChat] = useState<ChatType | null>(null);
    const [globalChats, setGlobalChats] = useState<ChatMessage[]>([]);
    const [teamChats, setTeamChats] = useState<ChatMessage[]>([]);
    const [dirtyTeams, setDirtyTeams] = useState<boolean>(false);
    const [dirtyGlobal, setDirtyGlobal] = useState<boolean>(false);

    const [pendingTeamMessages, setPendingTeamMessages] = useState<ChatMessage[]>([]);
    const [pendingGlobalMessages, setPendingGlobalMessages] = useState<ChatMessage[]>([]);

    const wsGlobalRef = useRef<WebSocket | null>(null);
    const wsTeamRef = useRef<WebSocket | null>(null);

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
                setDirtyGlobal(openChat !== "global");
            }
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
                    setDirtyTeams(openChat !== "team");
                }
            );
            wsTeamRef.current = wsTeam;
        }

        return () => {
            wsGlobal.close();
            wsTeam && wsTeam.close();
            wsGlobalRef.current = null;
            wsTeamRef.current = null;
        }
    }, [jwt, myTeam, openChat]);


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
                        prev.map(p => p.clientId === tempId ? { ...p, serverId: res.id, messageId: res.id } : p)
                    );
                    break;
                case "global":
                    setPendingGlobalMessages(prev =>
                        prev.map(p => p.clientId === tempId ? { ...p, serverId: res.id, messageId: res.id } : p)
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
    }, [openChat])

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

    return (
        <MessageContext.Provider value={{
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
        }}>
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