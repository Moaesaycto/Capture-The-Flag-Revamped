export type StandardStatus = {
    message: string,
}

export type Flag = {
    x: number,
    y: number,
}

export type Team = {
    id: String,
    name: String,
    color: String,
    flag: Flag,
}

export type Player = {
    id: String,
    name: String,
    team: Team,
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