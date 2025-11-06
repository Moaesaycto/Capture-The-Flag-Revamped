import type { GameStatus } from "../types";
import apiCall from "./api";

export const gameStatus = async () => {
    await apiCall<GameStatus>("game/status", "GET");
}