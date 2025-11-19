import { ANNOUNCEMENT_TYPES, type AnnouncementType } from "@/types";
import { useCallback, useState, type ChangeEvent } from "react";
import { FaLock, FaPaperPlane } from "react-icons/fa"
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { ErrorMessage } from "./Messages";
import { useAuthContext } from "../contexts/AuthContext";
import { gameAnnounce } from "@/services/GameApi";
import Container from "./Containers";

const AnnouncementController = () => {
    const [announcementType, setAnnouncementType] = useState<AnnouncementType>("emergency");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { jwt } = useAuthContext();

    const submit = useCallback(() => {
        if (!jwt) return;

        setLoading(true);
        if (announcementType == "custom" && message.length == 0) {
            setError("Custom announcements must include a message");
        }

        gameAnnounce(announcementType, message, jwt)
            .catch((e: any) => setError(e.message))
            .finally(() => setLoading(false));

    }, [setError, message, announcementType, jwt]);

    return (
        <Container Icon={FaLock} title="Announcement Controls">
            {error && <ErrorMessage message={error} />}
            <div className="flex gap-3 items-center">
                <Select
                    value={announcementType}
                    onValueChange={(val) => setAnnouncementType(val as AnnouncementType)}
                >
                    <SelectTrigger
                        className="
                            bg-neutral-900 border-none rounded
                            outline-none
                            focus:outline-none
                            focus-visible:outline-none

                            focus:ring-2 focus:ring-amber-400
                            data-[state=open]:ring-2 data-[state=open]:ring-amber-400
                        "
                    >

                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white border-none text-xl">
                        <SelectGroup>
                            {ANNOUNCEMENT_TYPES.map((e, k) => <SelectItem
                                value={e}
                                key={k}
                                className="focus:bg-amber-400"
                            >
                                {String(e).charAt(0).toUpperCase() + String(e).slice(1)}
                            </SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <input
                    className="bg-neutral-900 w-full py-1 px-2 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    name="name"
                    placeholder="Enter announcement message"
                    autoComplete="off"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                />
                <button
                    className={`bg-amber-400 text-black w-10 h-7.5 rounded flex justify-center items-center
                               hover:bg-amber-500 hover:cursor-pointer disabled:hover:cursor-not-allowed
                               disabled:hover:bg-amber-400 disabled:opacity-50`}
                    onClick={submit}
                    disabled={loading}
                >
                    <FaPaperPlane />
                </button>
            </div>
        </Container>

    )
}

export default AnnouncementController;