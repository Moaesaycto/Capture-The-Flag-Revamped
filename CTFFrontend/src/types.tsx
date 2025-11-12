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

export type GameState = {
    state: string
}

export type GameStatus = {
    game: GameInfoProps,
    players: Player[],
    state: GameState,
    teams: Team[],
}

type DeliveryStatus = "pending" | "delivered" | "failed";

export type ChatMessage = {
    player: Player,
    message: string,
    team: string,
    messageId: number,
    time: number,
    status?: DeliveryStatus,
}

export type MessageResponse = {
    id: number,
}
