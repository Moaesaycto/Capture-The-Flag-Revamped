import { useEffect, useRef, useState, type ComponentType } from "react";
import Spinner from "./LoadingSpinner";
type ControlButtonProps = {
    onClick: () => void | Promise<void>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onFinally?: () => void;
    color?: string;
    Icon: ComponentType;
    disabled?: boolean;
}

const DelayButton = ({
    onClick,
    onSuccess,
    onError,
    onFinally,
    color,
    Icon,
    disabled = false
}: ControlButtonProps) => {
    const DELAY = 2000;
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        if (disabled || isLoading) return;
        setIsHolding(true);
        startTimeRef.current = Date.now();
        animationRef.current = requestAnimationFrame(updateProgress);

        timerRef.current = setTimeout(async () => {
            if (disabled || isLoading) return;

            setIsLoading(true);
            resetButton();

            try {
                const result = onClick();

                if (result instanceof Promise) {
                    await result;
                }

                onSuccess?.();
            } catch (error) {
                onError?.(error instanceof Error ? error : new Error(String(error)));
            } finally {
                setIsLoading(false);
                onFinally?.();
            }
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
        if (!isLoading) {
            resetButton();
        }
    };

    const handleMouseLeave = () => {
        if (!isLoading) {
            resetButton();
        }
    };

    useEffect(() => {
        if (disabled) {
            resetButton();
        }
    }, [disabled]);

    const isDisabled = disabled || isLoading;

    return (
        <button
            className="bg-neutral-900 hover:bg-neutral-700 p-2 rounded-lg disabled:opacity-50
                       disabled:hover:bg-neutral-900 disabled:cursor-not-allowed relative overflow-hidden
                       h-9 w-9 transition-colors"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            style={{
                color,
                fontSize: "20px",
                cursor: isDisabled ? "not-allowed" : "pointer"
            }}
            disabled={isDisabled}
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
            <div className="absolute inset-[3px] bg-neutral-900 rounded-md pointer-events-none" />
            {/* Icon or Spinner */}
            <div className="relative z-10 flex items-center justify-center">
                {isLoading ? <Spinner size={20} /> : <Icon />}
            </div>
        </button>
    );
};

export default DelayButton;