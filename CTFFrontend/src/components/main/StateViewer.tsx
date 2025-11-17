import { useEffect, useState, useRef } from "react";
import { useGameContext } from "../contexts/GameContext";

const StateViewer = () => {
    const { state, currentDuration, isPaused, isRunning, stateUpdateKey } = useGameContext();
    const [displayTime, setDisplayTime] = useState(currentDuration);
    const intervalRef = useRef<number | null>(null);
    
    useEffect(() => {
        setDisplayTime(currentDuration);
    }, [stateUpdateKey, currentDuration]);
    
    useEffect(() => {
        const startTime = Date.now();
        const initialDuration = currentDuration;
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        if (!isRunning || isPaused) return;
        
        intervalRef.current = window.setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, initialDuration - elapsed);
            setDisplayTime(remaining);
            
            if (remaining <= 0 && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, 100);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [stateUpdateKey, isRunning, isPaused, currentDuration]);
    
    const totalSeconds = Math.floor(displayTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    
    return (
        <div>
            <span style={{ opacity: isPaused ? 0.5 : 1 }}>
                {minutes}:{seconds}
            </span>
            <span>{state}</span>
        </div>
    );
};

export default StateViewer;