import { useMemo } from "react";
import type { Player, Team } from "../../types";
import Color from "color";
import { RiAdminFill } from "react-icons/ri";
import { useAuthContext } from "../contexts/AuthContext";
import { BiSolidStar } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";
import { playerRemove } from "../../services/PlayerApi";
import { useGameContext } from "../contexts/GameContext";

type Align = "left" | "right" | "center";

const NameRow = ({ player, index, align }: { player?: Player, index: number, align: Align }) => {
    const { me, jwt } = useAuthContext();

    const onClick = () => {
        player && playerRemove(player.id, jwt);
    }

    return (
        <li
            className={`
                w-full flex items-center gap-1 px-2 py-0.5 h-7
                ${index % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-900'}
            `}
        >
            {player && <div className="w-full flex items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-1 flex-1">
                    <RiAdminFill style={{ color: "#FFB900", visibility: player.auth ? "visible" : "hidden" }} />
                    <span className={`flex-1 justify-${align} flex gap-1 items-center`}>
                        {me?.id == player?.id && <BiSolidStar className="inline" style={{ color: "gold" }} />}
                        {player.name}
                    </span>
                </div>
                <button className="hover:cursor-pointer" onClick={onClick}
                    style={{ visibility: me?.auth && !player.auth ? "visible" : "hidden" }}
                ><TbTrash color="#ff5e5e" /></button>
            </div>}
        </li>
    )
}

const PlayerList = () => {
    const { players, teams } = useGameContext();

    const TeamDisplay = ({ team, players, maxSize, align = "left" }: { team: Team, players: Player[], maxSize: number, align: Align }) => {
        const missingRows = maxSize - players.length;

        const sortedPlayers = useMemo(() => {
            return [...players].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            );
        }, [players]);

        const placeholderRows = useMemo(() => {
            return Array.from({ length: missingRows }).map((_, i) => {
                return <NameRow index={players.length + i} key={`placeholder-${team.id}-${i}`} align={align} />
            });
        }, [players.length, maxSize, team.id]);

        return (
            <div
                className="border-2 w-full"
                style={{
                    borderColor: team.color,
                    borderRadius: "0.25rem",
                    borderTop: "2xp",
                }}
            >
                <h2
                    className="w-full text-center uppercase"
                    style={{
                        borderColor: team.color,
                        color: team.color,
                        backgroundColor: Color(team.color).alpha(0.25).toString(),
                    }}
                >
                    {team.name}
                </h2>
                <ul className="w-full">
                    {sortedPlayers.map((p, idx) =>
                        <NameRow player={p} index={idx} key={`${p.id}-${idx}`} align={align} />
                    )}
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

    const maxSize = playersByTeam.length > 0
        ? Math.max(...playersByTeam.map(teamData => teamData.players.length))
        : 0;

    return (
        <div
            className="gap-4 w-full"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
        >
            {teams.map((t) => {
                const teamPlayers = playersByTeam.find(to => to.team === t.id)?.players ?? [];
                return <TeamDisplay team={t} players={teamPlayers} key={t.id} maxSize={maxSize} align={"center"} />;
            })}
        </div>
    )
}

export default PlayerList;