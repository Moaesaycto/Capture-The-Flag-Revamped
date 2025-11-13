import { type MessageChunk, type GameStatus, type MessageResponse } from "../types";
import apiCall from "./api";

export const gameStatus = async () => {
    return await apiCall<GameStatus>("game/status", "GET");
}

export const globalMessage = async (content: string, jwt: string) => {
    return await apiCall<MessageResponse>(`game/message/global`, "POST", { content }, jwt);
}

export const getGlobalMessages = async (start: number, count: number, jwt: string) => {
    return await apiCall<MessageChunk>(`game/message/global?start=${start}&count=${count}`, "GET", undefined, jwt)
}