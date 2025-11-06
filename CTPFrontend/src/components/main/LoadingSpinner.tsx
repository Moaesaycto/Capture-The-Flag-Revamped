type Props = {
    size?: number | string;
    thickness?: number;
    colorClass?: string;
    className?: string;
};

export default function Spinner({
    size = 24,
    thickness = 3,
    colorClass = "text-sky-500",
    className,
}: Props) {
    const s = typeof size === "number" ? `${size}px` : size;

    return (
        <span
            role="status"
            aria-label="Loading"
            className={`inline-block animate-spin rounded-full border-transparent border-solid ${colorClass} ${className ?? ""}`}
            style={{
                width: s,
                height: s,
                borderWidth: thickness,
                borderTopColor: "currentColor",
                borderRightColor: "currentColor",
            }}
        />
    );
}