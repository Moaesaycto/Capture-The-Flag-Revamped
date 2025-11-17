import type { IconType } from "react-icons";

export type StandardStatus = {
    message: string,
}

export type Flag = {
    x: number,
    y: number,
}

export type Team = {
    id: string,
    name: string,
    color: string,
    flag: Flag,
}

export type Player = {
    id: string,
    name: string,
    team: string,
    auth: boolean,
}

export type GameInfoProps = {
    graceTime: number,
    maxTeams: number,
    minPlayers: number,
    FFATime: number,
    maxPlayersPerTeam: number,
    scoutTime: number,
    minPlayerPerTeam: number,
}

export type GameStatus = {
    game: GameInfoProps,
    players: Player[],
    state: GameState,
    teams: Team[],
}

type DeliveryStatus = "pending" | "delivered" | "failed";

export type ChatType = "global" | "team";

export type Chat = {
    icon: IconType,
    title: string,
    path: string,
    type: ChatType,
    dirty: boolean,
    setDirty: (dirty: boolean) => void
}

export type ChatMessage = {
    player: Player,
    message: string,
    team: string,
    messageId: number,
    clientId?: number,
    serverId?: number,
    time: number,
    pending?: DeliveryStatus,
}

export type MessageResponse = {
    id: number,
}

export type MessageChunk = {
    messages: ChatMessage[],
    end: true,
}

export type State = "ready" | "grace" | "scout" | "ffa" | "ended" | "paused" | "loading"

export type GameState = {
    state: State,
    duration: number;
}