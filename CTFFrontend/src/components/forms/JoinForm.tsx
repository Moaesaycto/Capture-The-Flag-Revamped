import { useEffect, useState, type ChangeEvent } from "react";
import type { Team } from "../../types";
import { playerJoin } from "../../services/PlayerApi";
import Spinner from "../main/LoadingSpinner";
import { ErrorMessage } from "../main/Messages";
import { useAuthContext } from "../contexts/AuthContext";
import Color from "color";
import { useGameContext } from "../contexts/GameContext";
import { FaFlag } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

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
                style={{
                    color: team.color,
                    backgroundColor: Color(team.color).alpha(0.25).toString(),
                    borderColor: team.color
                }}
                className="justify-center 
                           w-10 h-10 font-semibold border-2 rounded flex gap-2 items-center
                           hover:cursor-pointer disabled:hover:scale-100 disabled:hover:cursor-not-allowed
                           uppercase disabled:opacity-50"
                aria-label={`Join Team ${team.name}`}
                type="submit"
                value={team.id}
                disabled={disabled}
            >
                <FaFlag />
                {/* <span>Join {team.name}</span> */}
            </button>
        )
    }

    return (
        <form onSubmit={onSubmit} className="w-full gap-3 bg-neutral-800 rounded relative" autoComplete="off">
            {error && <ErrorMessage message={error} />}
            {loading &&
                <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner />
                </div>
            }
            <div
                className="flex flex-col gap-2 items-center pb-5"
                style={{
                    visibility: loading ? "hidden" : "visible"
                }}
            >
                <div className="flex flex-row w-full gap-2 items-center">
                    <input
                        className="bg-neutral-900 flex-1 h-7 pl-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        name="name"
                        placeholder="Enter Name"
                        autoComplete="off"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                        value={name.slice(0, 32)}
                    />
                    <div
                        className="h-7 w-7 bg-neutral-900 rounded flex items-center justify-center"
                        style={{
                            background: wantsAuth ? "#FFD230" : "#171717",
                            color: wantsAuth ? "black" : "white"
                        }}
                        onClick={() => setWantsAuth(prev => !prev)}
                    >
                        <RiAdminFill />
                    </div>
                </div>

                {wantsAuth &&
                    <input
                        className="bg-neutral-900 w-full rounded focus:ring-2 focus:ring-amber-400 focus:outline-none py-1 px-2"
                        placeholder="Password"
                        name="password"
                        type="password"
                        onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                        autoComplete="off"
                    />}
                <div className="flex flex-row w-full justify-around p-2 pl-4 gap-4 bg-neutral-900 rounded items-center">
                    <span className="flex-1">Select your team:</span>
                    {teams.map((t, key) => <TeamButton team={t} key={key} disabled={loading || name.length < 1} />)}
                </div>
            </div>
        </form>
    )
}

export default JoinForm;