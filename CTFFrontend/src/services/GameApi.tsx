import type { GameStatus, MessageResponse } from "../types";
import apiCall from "./api";

export const gameStatus = async () => {
    return await apiCall<GameStatus>("game/status", "GET");
}

export const globalMessage = async (content: string, jwt: string) => {
    return await apiCall<MessageResponse>(`game/message/global`, "POST", { content }, jwt);
}