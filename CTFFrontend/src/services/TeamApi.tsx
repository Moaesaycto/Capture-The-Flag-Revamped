import type { MessageChunk, MessageResponse, Team } from "../types";
import apiCall from "./api";

export const teamGet = async (id: string) => {
    return await apiCall<Team>(`team/info/${id}`, "GET");
}

export const teamMessage = async (content: string, id: string | undefined, jwt: string) => {
    return await apiCall<MessageResponse>(`team/message/${id}`, "POST", { content }, jwt);
}

export const getTeamMessages = async (start: number, count: number, team: string, jwt: string) => {
    return await apiCall<MessageChunk>(`team/message/${team}?start=${start}&count=${count}`, "GET", undefined, jwt);
}