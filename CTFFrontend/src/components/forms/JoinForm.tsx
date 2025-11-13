import { useEffect, useState, type ChangeEvent } from "react";
import type { Team } from "../../types";
import { playerJoin } from "../../services/PlayerApi";
import { FaFlag } from "react-icons/fa";
import Spinner from "../main/LoadingSpinner";
import { ErrorMessage } from "../main/Messages";
import { useAuthContext } from "../contexts/AuthContext";
import Color from "color";
import { useGameContext } from "../contexts/GameContext";

const JoinForm = () => {
    const [wantsAuth, setWantsAuth] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>("");

    const { hydrate } = useAuthContext();
    const { teams, loading: gameLoading } = useGameContext();

    useEffect(() => {
        if (gameLoading && !teams) {
            setError("Unable to collect team information");
        } else {
            setLoading(false);
        }
    }, [teams, gameLoading]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const formData = new FormData(e.currentTarget);

        const data = {
            team: submitter?.value ?? "",
            name: formData.get("name")?.toString() ?? "",
            auth: wantsAuth,
            password: formData.get("password")?.toString() ?? ""
        }

        playerJoin(data)
            .then(e => hydrate(e.access_token))
            .catch(
                (e: any) => {
                    setError(e?.message ?? e);
                    setLoading(false);
                });
    }

    const TeamButton = ({ team, disabled }: { team: Team, disabled?: boolean }) => {
        return (
            <button
                style={{ color: team.color, backgroundColor: Color(team.color).alpha(0.25).toString() }}
                className="flex-1 justify-center 
                           px-5 py-1 font-semibold border-2 rounded flex gap-2 items-center transition duration-150
                           hover:scale-105 hover:cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:hover:cursor-not-allowed"
                aria-label={`Join Team ${team.name}`}
                type="submit"
                value={team.id}
                disabled={disabled}
            >
                <FaFlag />
                <span>
                    Join Team {team.name}
                </span>
            </button>
        )
    }

    return (
        <div>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={onSubmit} className="w-full gap-3 bg-neutral-800 p-3 rounded relative">
                {loading &&
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Spinner />
                    </div>
                }
                <div
                    className="flex flex-col gap-2 items-center"
                    style={{
                        visibility: loading ? "hidden" : "visible"
                    }}
                >
                    <div className="flex flex-row w-full gap-2 items-center">
                        <input
                            className="bg-neutral-900 w-full py-1 px-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            name="name"
                            placeholder="Enter Name"
                            autoComplete="off"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                            value={name.slice(0, 32)}
                        />
                        <input
                            className="appearance-none h-7 w-7 bg-black checked:bg-amber-300 rounded"
                            type="checkbox"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => { setWantsAuth(e.target.checked) }}
                        />
                    </div>

                    {wantsAuth &&
                        <input
                            className="bg-neutral-900 w-full py-1 px-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            placeholder="Password"
                            name="password"
                            type="password"
                            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                        />}
                    <div className="flex flex-row w-full justify-around p-1 gap-4">
                        {teams.map((t, key) => <TeamButton team={t} key={key} disabled={loading || name.length < 1} />)}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default JoinForm;