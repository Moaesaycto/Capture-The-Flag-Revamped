import type { Team } from "../types";
import apiCall from "./api";

export const teamGet = async (id: string) => {
    return await apiCall<Team>("team", "POST", { id });
}