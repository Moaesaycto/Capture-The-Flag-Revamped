import { type StandardStatus, type Player } from "../types"
import apiCall from "./api"

export type PlayerJoinRequest = {
    team: string,
    name: string,
    auth: boolean,
    password: string,
}

export type PlayerJoinResponse = {
    message: string,
    access_token: string,
    token_type: string,
}

export const playerJoin = async ({ team, name, auth, password }: PlayerJoinRequest) => {
    const req: PlayerJoinRequest = {
        team,
        name,
        auth,
        password,
    }

    return await apiCall<PlayerJoinResponse>("player/join", "POST", req);
}

export const playerMe = async (jwt: string) => {
    return await apiCall<Player>("player/me", "GET", undefined, jwt ?? "");
}

export const playerLeave = async (jwt: string | null) => {
    return await apiCall<StandardStatus>("player/leave", "DELETE", undefined, jwt ?? "");
}

export const playerRemove = async (id: string, jwt: string | null) => {
    return await apiCall<StandardStatus>("player/remove", "DELETE", { id }, jwt ?? "");
}