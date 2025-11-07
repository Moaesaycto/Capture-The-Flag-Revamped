import { useEffect, useMemo, useState } from "react";
import type { Player, Team } from "../../types";
import { gameStatus } from "../../services/GameApi";
import { createWebSocket } from "../../services/api";
import Color from "color";
import { RiAdminFill } from "react-icons/ri";
import { useAuthContext } from "../contexts/AuthContext";
import { BiSolidStar } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";
import { playerRemove } from "../../services/PlayerApi";

const NameRow = ({ player, index }: { player?: Player, index: number }) => {
    const { me, jwt } = useAuthContext();

    const onClick = () => {
        player && playerRemove(player.id, jwt);
    }
    return (
        <li
            key={index}
            className={`
                w-full flex items-center gap-1 px-2 py-0.5 h-7
                ${index % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-900'}
                `}
        >
            {player && <div className="w-full flex items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                    {player.auth && <RiAdminFill style={{ color: "#FFB900" }} />}
                    <span>{player.name}</span>
                </div>
                {me?.id == player?.id ? <BiSolidStar style={{ color: "gold" }} /> :
                    me?.auth ? player.auth || <button className="hover:cursor-pointer" onClick={onClick}><TbTrash color="#ff5e5e" /></button> : null
                }

            </div>}
        </li>
    )
}

const PlayerList = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const { logout, me } = useAuthContext();

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
            if (player.id === me?.id) logout();
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

        const sortedPlayers = useMemo(() => {
            return [...players].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            );
        }, [players]);

        const placeholderRows = useMemo(() => {
            return Array.from({ length: missingRows }).map((_, i) => {
                return <NameRow index={players.length + i} key={players.length + i} />
            });
        }, [players.length, maxSize]);

        return (
            <div
                className="border-2 rounded w-full"
                style={{ borderColor: team.color }}
            >
                <h2
                    className="w-full text-center uppercase"
                    style={{
                        borderColor: team.color,
                        color: team.color,
                        backgroundColor: Color(team.color).alpha(0.25).toString(),
                    }}
                >
                    {team.name}</h2>
                <ul className="w-full">
                    {sortedPlayers.map((p, i) => <NameRow player={p} index={i} key={i} />)}
                    {placeholderRows}
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

export default PlayerList;