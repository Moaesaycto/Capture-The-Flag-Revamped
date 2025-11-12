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
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const { jwt, myTeam } = useAuthContext();

    const [openChat, setOpenChat] = useState<ChatType | null>(null);
    const [globalChats, setGlobalChats] = useState<ChatMessage[]>([]);
    const [teamChats, setTeamChats] = useState<ChatMessage[]>([]);
    const [dirtyTeams, setDirtyTeams] = useState<boolean>(false);
    const [dirtyGlobal, setDirtyGlobal] = useState<boolean>(false);

    const wsGlobalRef = useRef<WebSocket | null>(null);
    const wsTeamRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const wsGlobal = createWebSocket(
            "global",
            jwt ?? undefined,
            (m: string) => {
                setGlobalChats(prev => [...prev, JSON.parse(m)]);
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
                    setTeamChats(prev => [...prev, JSON.parse(m)]);
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

    const sendMessage = useCallback((message: string): Promise<MessageResponse> => {
        if (!jwt) return Promise.reject(new Error("No JWT detected"));

        if (!openChat) return Promise.reject(new Error("No chat selected"));

        switch (openChat) {
            case "team":
                if (!myTeam?.id) return Promise.reject(new Error("No team selected"));
                return teamMessage(message, myTeam.id, jwt);
            case "global":
                return globalMessage(message, jwt);
            default:
                return Promise.reject(new Error("Unknown chat type"));
        }
    }, [jwt, openChat]);

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