import type { GameStatus } from "../types";
import apiCall from "./api";

export const gameStatus = async () => {
    return await apiCall<GameStatus>("game/status", "GET");
}