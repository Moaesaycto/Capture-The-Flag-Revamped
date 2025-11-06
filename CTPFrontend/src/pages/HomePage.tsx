import { useEffect, useState, type ChangeEvent } from "react";
import Page from "../components/main/Page";
import { gameStatus } from "../services/GameApi";
import type { Team } from "../types";
import { FaFlag } from "react-icons/fa";
import { playerJoin } from "../services/PlayerApi";

const HomePage = () => {
    const [wantsAuth, setWantsAuth] = useState<boolean>(false);
    const [teams, setTeams] = useState<Team[]>([]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const formData = new FormData(e.currentTarget);

        const data = {
            team: submitter?.value ?? "",
            name: formData.get("name")?.toString() ?? "",
            auth: formData.get("auth") === "on",
            password: formData.get("password")?.toString() ?? ""
        }

        console.log(data);

        playerJoin(data);
    }

    const TeamButton = ({ team }: { team: Team }) => {
        return (
            <button
                style={{ color: team.color }}
                className="px-3 py-1 font-semibold border-2 rounded flex gap-2 items-center transition duration-150
                           hover:scale-105 hover:cursor-pointer"
                aria-label={`Team ${team.name}`}
                type="submit"
                value={team.id}
            >
                <FaFlag />
                <span>
                    {team.name}
                </span>
            </button>
        )
    }

    useEffect(() => {
        gameStatus().then(r => {
            console.log(r);
            setTeams(r.teams);
        });
    }, []);

    useEffect(() => {
        console.log('Teams updated:', teams);
    }, [teams]);


    return (
        <Page>
            <form onSubmit={onSubmit}>
                <input
                    className="bg-neutral-800"
                    name="name"
                    placeholder="Enter Name"
                />
                <div>
                    <input
                        type="checkbox"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => { setWantsAuth(e.target.checked) }}
                    />
                    <label>Auth?</label>
                </div>
                {wantsAuth && <div>
                    <input
                        className="bg-neutral-800"
                        placeholder="Password"
                        name="password"
                    />
                </div>}
                <div className="flex gap-3">
                    {teams.map((t, key) => <TeamButton team={t} key={key} />)}
                </div>
            </form>
        </Page>
    )
}

export default HomePage;