import type { Chat, ChatType } from "@/types";
import { useSettingsContext } from "../contexts/SettingsContext";

type ChatTabsProps = {
  chats: Chat[];
  openChat: ChatType | null;
  setOpenChat: (chat: ChatType) => void;
};

const ChatTabs = ({ chats, openChat, setOpenChat }: ChatTabsProps) => {

  const { wantsNewMessageBadges } = useSettingsContext();

  return (
    <div className="bg-neutral-900 h-10 w-full flex flex-row items-center justify-around text-white text-lg ">
      {chats.map((c, k) => (
        <li
          key={k}
          className={`list-none flex items-center gap-2 h-full w-1/2 px-2 justify-center hover:cursor-pointer
          ${openChat == c.type ? "bg-neutral-950 shadow-xl" : "hover:bg-neutral-800"}`}
          onClick={() => { setOpenChat(c.type) }}
        >
          {wantsNewMessageBadges && c.dirty && <div className="w-3 h-3 bg-red-500 border-red-900 rounded-full -top-1.5 -left-1.5" />}
          <c.icon />
          <span className="truncate">{c.title}</span>
        </li>
      ))}
    </div>
  );
}

export default ChatTabs;