import { useRef, useState, type ComponentType } from "react";

type ControlButtonProps = {
    onClick: () => void;
    color?: string;
    Icon: ComponentType;
    disabled?: boolean;
}

const DelayButton = ({ onClick, color, Icon, disabled = false }: ControlButtonProps) => {
    const DELAY = 2000;
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const animationRef = useRef<number | null>(null);

    const updateProgress = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min((elapsed / DELAY) * 100, 100);
        setProgress(newProgress);

        if (newProgress < 100) {
            animationRef.current = requestAnimationFrame(updateProgress);
        }
    };

    const handleMouseDown = () => {
        if (disabled) return;

        setIsHolding(true);
        startTimeRef.current = Date.now();
        animationRef.current = requestAnimationFrame(updateProgress);
        timerRef.current = setTimeout(() => {
            if (!disabled) {
                onClick();
            }
            resetButton();
        }, DELAY);
    };

    const resetButton = () => {
        setIsHolding(false);
        setProgress(0);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    const handleMouseUp = () => {
        resetButton();
    };

    const handleMouseLeave = () => {
        resetButton();
    };

    useState(() => {
        if (disabled) {
            resetButton();
        }
    });

    return (
        <button
            className="bg-neutral-900 hover:bg-neutral-700 p-2 rounded-lg disabled:opacity-50 disabled:hover:bg-neutral-900 disabled:cursor-not-allowed relative overflow-hidden transition-colors"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            style={{
                color,
                fontSize: "20px",
                cursor: disabled ? "not-allowed" : "pointer"
            }}
            disabled={disabled}
        >
            {/* Progress border */}
            <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                    background: `conic-gradient(${color} ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
                    opacity: isHolding ? 1 : 0,
                    transition: isHolding ? 'none' : 'opacity 0.2s'
                }}
            />

            {/* Inner content area to create border effect */}
            <div className="absolute inset-[3px] bg-neutral-900 rounded-lg pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10">
                <Icon />
            </div>
        </button>
    );
};

export default DelayButton;