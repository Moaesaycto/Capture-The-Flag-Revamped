import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import { FaFlag } from "react-icons/fa";
import Color from "color";
import map from "@/assets/syd_park_map.png";

type FlagMarkerProps = {
    color: string,
    x: number,
    y: number,
}

const FlagMarker = ({ color, x, y }: FlagMarkerProps) => {
    return (
        <div
            className="w-5 h-5 rounded-full bg-green-600 border-2 flex items-center justify-center"
            style={{
                backgroundColor: Color(color).alpha(0.25).toString(),
                borderColor: color,
                color: color,
                fontSize: "0.6rem",
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
            }}
        >
            <FaFlag />
        </div>
    );
}

const MapViewer = () => {
    const { state, teams } = useGameContext();
    const { myTeam } = useAuthContext();

    useEffect(() => {
        console.log(teams);
    }, [myTeam]);

    return (
        <div>
            <div
                className="w-full relative bg-neutral-600 shadow-xl rounded overflow-hidden"
            >
                {state === "ffa" ?
                    (teams.filter(t => t.flag !== null).map((t, k) => <FlagMarker x={t.flag!.x} y={t.flag!.y} color={t.color} key={k} />))
                    :

                    (myTeam?.registered && <FlagMarker x={myTeam.flag!.x} y={myTeam.flag!.y} color={myTeam.color} />)}
                <img src={map} alt="map" className="w-full h-full object-contain" style={{ pointerEvents: "none" }} />
            </div>
        </div>
    );
}

export default MapViewer;