import type { ComponentType } from "react";
import DelayButton from "./DelayButton";

type LabelDelayButtonProps = {
    title: string,
    description?: string,
    onClick: () => void | Promise<any>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onFinally?: () => void;
    color?: string;
    Icon: ComponentType;
    disabled?: boolean;
}

const LabelDelayButton = ({ title, description, onClick, onSuccess, onError, color, Icon, disabled }: LabelDelayButtonProps) => {
    return (
        <div className="flex flex-row justify-between items-center bg-neutral-900 py-2 px-4 rounded gap-2">
            <div className="flex flex-col gap-1 flex-1">
                <span className="flex-1">{title}</span>
                {description && <span className="text-xs text-neutral-500 flex-1">{description}</span>}
            </div>
            <div className="h-full">
                <DelayButton onClick={onClick} onSuccess={onSuccess} onError={onError} Icon={Icon} color={color} disabled={disabled} />
            </div>
        </div>
    )
}

export default LabelDelayButton;