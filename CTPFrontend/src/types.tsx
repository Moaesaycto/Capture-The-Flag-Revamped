export type Team = {
    id: String,
    name: String,
    color: String,
}

export type Player = {
    id: String,
    name: String,
    team: Team,
    auth: boolean,
}