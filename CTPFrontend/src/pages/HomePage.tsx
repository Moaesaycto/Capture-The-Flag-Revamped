import Page from "../components/main/Page";
import JoinForm from "../components/forms/JoinForm";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { createWebSocket } from "../services/api";
import { type Player, type Team } from "../types";
import { gameStatus } from "../services/GameApi";
import Color from "color";
import { RiAdminFill } from "react-icons/ri";

const HomePage = () => {
    const { loggedIn } = useAuthContext();

    return (
        <Page>
            {loggedIn ? <PlayerInfo /> : <JoinForm />}
            <PlayerList />
        </Page>
    )
}

const PlayerInfo = () => {
    const { me } = useAuthContext();

    return (
        <div>
            {me?.name}
        </div>
    )
}

const PlayerList = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        gameStatus().then(res => {
            setTeams(res.teams);
            setPlayers(res.players);
        });
    }, [])

    const parseMessage = (msg: string) => {
        const newP = msg.startsWith("joined");
        const match = msg.match(/\{.*$/s);

        if (!match) return;
        const player: Player = JSON.parse(match[0])

        if (newP) {
            setPlayers(prev => [...prev, player]);
        } else {
            setPlayers(prev => prev.filter(p => p.id !== player.id));
        }
    }

    useEffect(() => {
        const socket = createWebSocket(
            "players",
            undefined,
            parseMessage
        );

        return () => {
            socket.close();
        };
    }, []);

    const TeamDisplay = ({ team, players, maxSize }: { team: Team, players: Player[], maxSize: number }) => {
        const missingRows = maxSize - players.length;

        const placeholderRows = useMemo(() => {
            if (missingRows <= 0) return null;

            return Array.from({ length: missingRows }).map((_, i) => {
                const placeholderIndex = players.length + i;

                return <li
                    key={`placeholder-${team.id}-${i}`}
                    className={`px-2 py-0.5 h-7 italic text-neutral-500 flex items-center ${placeholderIndex % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-900'}`}
                />
            });
        }, [players.length, maxSize, team.id, missingRows]);

        return (
            <div
                className="border-2 rounded w-full"
                style={{ borderColor: team.color }}
            >
                <h2
                    className="w-full border-b-2 text-center uppercase"
                    style={{
                        borderColor: team.color,
                        color: team.color,
                        backgroundColor: Color(team.color).alpha(0.25).toString(),
                    }}
                >
                    {team.name}</h2>
                <ul>
                    {players.map((p, i) => {
                        return (
                            <li
                                key={p.id}
                                className={`flex items-center gap-1 px-2 py-0.5 h-7 ${i % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-900'}`}
                            >
                                {p.auth && <RiAdminFill style={{color: "#FFB900"}} />}
                                {p.name}
                            </li>
                        )
                    })}
                    { placeholderRows }
                </ul>
            </div>
        )
    }


    type ByTeam = {
        team: string;
        players: Player[];
    }

    const playersByTeam = useMemo<ByTeam[]>(() => {
        return players.reduce<ByTeam[]>((acc, p) => {
            console.log(acc);
            const existing = acc.find(t => t.team === p.team);

            if (existing) {
                existing.players.push(p);
            } else {
                acc.push({ team: p.team, players: [p] });
            }

            return acc;
        }, []);
    }, [players]);

    const maxSize = Math.max(
        ...playersByTeam.map(teamData => teamData.players.length)
    );

    return (
        <div className="py-5 grid gap-4 w-full sm:grid-cols-2">
            {teams.map((t, i) => {
                const teamPlayers = playersByTeam.find(to => to.team === t.id)?.players ?? [];
                return <TeamDisplay team={t} players={teamPlayers} key={i} maxSize={maxSize} />;
            })}
        </div>
    )
}

export default HomePage;