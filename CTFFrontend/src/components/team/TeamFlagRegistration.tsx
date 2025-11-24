import { useCallback, useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import Spinner from "../main/LoadingSpinner";
import map from "@/assets/syd_park_map.png";
import Color from "color";
import { FaFlag } from "react-icons/fa";
import LabelDelayButton from "../main/Buttons";
import { ErrorMessage } from "../main/Messages";
import { registerFlag } from "@/services/TeamApi";
import { useNavigate } from "react-router-dom";

const TeamFlagRegistration = () => {
    const navigate = useNavigate();

    const { jwt, myTeam } = useAuthContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const nodeRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const onClick = useCallback(async () => {
        setError(null);

        if (!pos) {
            setError("No flag position set");
            return;
        }

        if (!myTeam) {
            setError("Not on a team");
            return
        }

        if (!jwt) {
            setError("No account token set");
            return;
        }

        await registerFlag(pos?.x, pos?.y, myTeam?.id, jwt);
    }, [jwt, myTeam, pos, setLoading, setError]);


    function clientToPercent(clientX: number, clientY: number) {
        const container = containerRef.current;
        if (!container) return null;

        const rect = container.getBoundingClientRect();

        const relX = clientX - rect.left;
        const relY = clientY - rect.top;
        const pctX = Math.min(100, Math.max(0, (relX / rect.width) * 100));
        const pctY = Math.min(100, Math.max(0, (relY / rect.height) * 100));

        return { x: pctX, y: pctY };
    }

    function handleMarkerPointerDown(e: React.PointerEvent) {
        e.stopPropagation();
        setIsDragging(true);
        (e.target as Element).setPointerCapture?.(e.pointerId);
    }

    function handleMarkerPointerMove(e: React.PointerEvent) {
        if (!isDragging) return;
        const p = clientToPercent(e.clientX, e.clientY);
        if (!p) return;
        setPos(p);
    }

    function handleMarkerPointerUp(e: React.PointerEvent) {
        setIsDragging(false);
        (e.target as Element).releasePointerCapture?.(e.pointerId);
    }

    function handleContainerPointerDown(e: React.PointerEvent) {
        if (e.button && e.button !== 0) return;
        const p = clientToPercent(e.clientX, e.clientY);
        if (!p) return;
        setPos(p);
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        e.preventDefault();
    }

    function handleContainerPointerMove(e: React.PointerEvent) {
        if (!isDragging) return;
        const p = clientToPercent(e.clientX, e.clientY);
        if (!p) return;
        setPos(p);
    }

    function handleContainerPointerUp(e: React.PointerEvent) {
        if (!isDragging) return;
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    }

    return (
        <div>
            {error && <ErrorMessage message={error} />}
            {loading && <Spinner />}
            <div
                className="w-full relative bg-neutral-600 shadow-xl rounded overflow-hidden mb-2"
                ref={containerRef}
                style={{
                    touchAction: "none",
                    cursor: isDragging ? "grabbing" : "crosshair"
                }}
                onPointerDown={handleContainerPointerDown}
                onPointerMove={handleContainerPointerMove}
                onPointerUp={handleContainerPointerUp}
            >
                {pos && <div
                    ref={nodeRef}
                    className="w-5 h-5 rounded-full bg-green-600 border-2 flex items-center justify-center"
                    onPointerDown={handleMarkerPointerDown}
                    onPointerMove={handleMarkerPointerMove}
                    onPointerUp={handleMarkerPointerUp}
                    style={{
                        backgroundColor: Color(myTeam?.color).alpha(0.25).toString(),
                        borderColor: myTeam?.color,
                        color: myTeam?.color,
                        fontSize: "0.6rem",
                        position: "absolute",
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: "translate(-50%, -50%)",
                        touchAction: "none",
                        userSelect: "none",
                        cursor: isDragging ? "grabbing" : "grab",
                    }}
                >
                    <FaFlag />
                </div>}
                <img src={map} alt="map" className="w-full h-full object-contain" style={{ pointerEvents: "none" }} />
            </div>
            <LabelDelayButton
                title="Hold to confirm map location"
                description="You can do this as many times as you need during the grace period."
                onClick={onClick}
                onError={(e) => setError(e.message)}
                onSuccess={() => navigate("/")}
                Icon={FaFlag}
                color={myTeam?.color}
                padding={false}
            />
        </div>
    );
}

export default TeamFlagRegistration;