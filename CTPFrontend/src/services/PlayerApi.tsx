import type { StandardStatus } from "../types";
import apiCall from "./api"

export type PlayerJoinRequest = {
    team: string,
    name: string,
    auth: boolean,
    password: string,
}

export const playerJoin = async ({ team, name, auth, password }: PlayerJoinRequest) => {
    const req: PlayerJoinRequest = {
        team,
        name,
        auth,
        password,
    }

    return await apiCall<StandardStatus>("player/join", "POST", req);
}