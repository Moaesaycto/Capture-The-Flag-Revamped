import { registerFlag } from "@/services/TeamApi";
import { useCallback, useState, type ChangeEvent } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import Spinner from "../main/LoadingSpinner";

const TeamFlagRegistration = () => {
    const { jwt, myTeam } = useAuthContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [x, setX] = useState<number | null>(null);
    const [y, setY] = useState<number | null>(null);

    const onClick = useCallback(() => {
        setError(null);

        if (x === null || y === null) {
            setError("Invalid coordinates given");
            return;
        }

        if (!myTeam) {
            setError("No team selected");
            return;
        }

        if (!jwt) {
            setError("No valid token found");
            return;
        }

        setLoading(true);
        registerFlag(x, y, myTeam?.id!, jwt)
            .catch((e: any) => setError(e.message))
            .finally(() => setLoading(false));

    }, [jwt, myTeam, x, y, setLoading, setError]);


    return (
        <div>
            {error && <span>{error}</span>}
            {loading && <Spinner />}
            <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setX(parseInt(e.target.value))
                }}
            />
            <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setY(parseInt(e.target.value))
                }}
            />
            <button onClick={onClick}>
                Submit
            </button>
        </div>
    )
}

export default TeamFlagRegistration;