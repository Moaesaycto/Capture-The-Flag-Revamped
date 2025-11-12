import type { MessageResponse, Team } from "../types";
import apiCall from "./api";

export const teamGet = async (id: string) => {
    return await apiCall<Team>(`team/info/${id}`, "GET");
}

export const teamMessage = async (content: string, id: string | undefined, jwt: string) => {
    return await apiCall<MessageResponse>(`team/message/${id}`, "POST", { content }, jwt);
}