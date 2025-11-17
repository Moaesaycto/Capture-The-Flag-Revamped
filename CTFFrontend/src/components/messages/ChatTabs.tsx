import type { Chat, ChatType } from "@/types";

type ChatTabsProps = {
  chats: Chat[];
  openChat: ChatType | null;
  setOpenChat: (chat: ChatType) => void;
};

const ChatTabs = ({ chats, openChat, setOpenChat }: ChatTabsProps) => (
  <div className="bg-amber-400 h-8 w-full rounded-t-md flex flex-row items-center justify-around text-black text-lg gap-2 px-1">
    {chats.map((c, k) => (
      <li
        key={k}
        className={`list-none flex items-center gap-2 h-6 justify-center rounded-md flex-1 hover:cursor-pointer
          ${openChat == c.type ? "bg-amber-600 shadow-xl" : "hover:bg-amber-300"}`}
        onClick={() => { setOpenChat(c.type) }}
      >
        {c.dirty && <div className="w-3 h-3 bg-red-500 border-red-900 rounded-full -top-1.5 -left-1.5" />}
        <c.icon />
        <span>{c.title}</span>
      </li>
    ))}
  </div>
);

export default ChatTabs;