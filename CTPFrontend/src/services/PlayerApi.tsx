import apiCall from "./api"

type PlayerJoinRequest = {
    team: string,
    name: string,
    auth: boolean,
    password?: string,
}

const playerJoin = async ({ team, name, auth, password }: PlayerJoinRequest) => {

    const req: PlayerJoinRequest = {
        team,
        name,
        auth,
        password,
    }

    await apiCall<PlayerJoinRequest>("player/join", "POST", req);
}