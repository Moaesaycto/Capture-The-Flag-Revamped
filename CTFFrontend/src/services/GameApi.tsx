import type { MessageChunk, GameStatus, MessageResponse, StandardStatus } from "../types";
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

export const gameStart = async (jwt: string) => {
    return await apiCall<StandardStatus>(`game/control/start`, "POST", {}, jwt);
}

export const gamePause = async (jwt: string) => {
    return await apiCall<StandardStatus>(`game/control/pause`, "POST", {}, jwt);
}

export const gameResume = async (jwt: string) => {
    return await apiCall<StandardStatus>(`game/control/resume`, "POST", {}, jwt);
}

export const gameSkip = async (jwt: string) => {
    return await apiCall<StandardStatus>(`game/control/skip`, "POST", {}, jwt);
}

export const gameRewind = async (jwt: string) => {
    return await apiCall<StandardStatus>(`game/control/rewind`, "POST", {}, jwt);
}

export const gameEnd = async (jwt: string) => {
    return await apiCall<StandardStatus>(`game/control/end`, "POST", {}, jwt);
}

export const gameReset = async (hard: boolean, jwt: string) => {
    return await apiCall<StandardStatus>(`game/control/reset`, "POST", { hard }, jwt);
}