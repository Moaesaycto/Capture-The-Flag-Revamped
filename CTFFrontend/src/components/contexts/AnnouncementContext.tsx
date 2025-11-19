import type { Announcement, StandardStatus } from "@/types";


interface AnnouncementContextValue {
    announce: (announcement: Announcement) => Promise<StandardStatus>;
}

