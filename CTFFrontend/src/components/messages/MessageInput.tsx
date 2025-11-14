import { FaPaperPlane } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FC } from "react";
import { useMessageContext } from "../contexts/MessageContext";

interface MessageInputProps<T = any> {
    value: string;
    onChange: (val: string) => void;
    sendMessage: (message: string) => Promise<T>;
    disabled?: boolean;
    maxLength?: number;
    placeholder?: string;
}

const MessageInput: FC<MessageInputProps> = ({
    value,
    onChange,
    sendMessage,
    disabled = false,
    maxLength = 256,
    placeholder = "",
}) => {
    const { isOpenChatLoading, chatError } = useMessageContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const canSend = useMemo(() => {
        if (isOpenChatLoading || chatError) return false;
        const message = value.trim();
        const textOk = message.length > 0 && message.length <= maxLength;
        return !loading && !disabled && textOk;
    }, [value, loading, disabled, maxLength, isOpenChatLoading, chatError]);

    // Reset focus after sent
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [value]);

    const onSubmit = async () => {
        if (!canSend) return;
        setLoading(true);
        setError(null);
        try {
            await sendMessage(value);
            onChange(""); // clear input
        } catch (err: any) {
            setError(err?.message ?? "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {value.length > maxLength && (
                <div className="text-xs px-4 h-2 text-red-800">
                    Messages cannot exceed {maxLength} characters
                </div>
            )}
            {error && (
                <div className="text-xs px-4 h-2 text-red-800">
                    {error}
                </div>
            )}

            <div className="relative py-4 px-4 flex flex-row gap-4 items-center">
                <input
                    ref={inputRef}
                    className={`bg-neutral-900 w-full py-1 px-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none
                               disabled:hover:cursor-not-allowed disabled:opacity-50`}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled || loading}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSubmit();
                    }}
                />
                <button
                    className={`bg-amber-400 text-black w-10 h-7.5 rounded flex justify-center items-center
                               hover:bg-amber-500 hover:cursor-pointer disabled:hover:cursor-not-allowed
                               disabled:hover:bg-amber-400 disabled:opacity-50`}
                    disabled={!canSend}
                    onClick={onSubmit}
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
