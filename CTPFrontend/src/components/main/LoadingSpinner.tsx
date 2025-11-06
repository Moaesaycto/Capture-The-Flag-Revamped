type Props = {
    size?: number | string;
    thickness?: number;
    colorClass?: string;
    className?: string;
};

export default function Spinner({
    size = 24,
    thickness = 3,
    className,
}: Props) {
    const s = typeof size === "number" ? `${size}px` : size;

    return (
        <span
            role="status"
            aria-label="Loading"
            className={`inline-block animate-spin rounded-full border-solid ${className ?? ""}`}
            style={{
                width: s,
                height: s,
                borderWidth: thickness,
                borderColor: "rgba(0,0,0,0.12)",
                borderTopColor: "currentColor",
                boxSizing: "border-box",
                borderStyle: "solid",
            }}
        />

    );
}