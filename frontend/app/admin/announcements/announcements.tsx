"use client";

import type { PostType } from "@/lib/schemas";
import type { UserType } from "@/types/user";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Announcement from "@/components/home/announcement";
import NewAnnouncement from "@/components/admin/new-announcement";

const filters = ["All", "Pinned", "Not pinned", "Archived", "Not archived"];

interface AnnoucementsProps {
  announcementData: PostType[];
  user: UserType;
}

function Announcements({ announcementData, user }: AnnoucementsProps) {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>(filters[0]);
  const announcements = announcementData.filter((a) => {
    let base =
      a.title.toLowerCase().includes(search.trim().toLowerCase()) ||
      a.content.toLowerCase().includes(search.trim().toLowerCase());
    if (!base) return false;
    switch (filter) {
      case filters[0]:
        base = true;
        break;
      case filters[1]:
        base = a.pinned;
        break;
      case filters[2]:
        base = !a.pinned;
        break;
      case filters[3]:
        base = a.archived || false;
        break;
      case filters[4]:
        base = !a.archived;
        break;
    }
    return base;
  });

  return (
    <div className="flex flex-col gap-y-5">
      <NewAnnouncement />
      <div className="flex gap-x-10 items-center">
        <Input
          placeholder={`Search announcements (${announcementData.length})`}
          value={search}
          setValue={(s) => setSearch(s)}
          styles="w-100!"
          clear
        />
        <div className="flex gap-x-3 items-center" title="Filter announcements">
          <FaFilter size={18} />
          <Dropdown
            value={filter}
            setValue={(t) => setFilter(t)}
            values={filters}
            label="Filters"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-y-5">
        {announcements.length > 0 ? (
          announcements.map((announcement) => {
            return (
              <Announcement
                key={announcement.id}
                announcement={announcement}
                user={user}
              />
            );
          })
        ) : (
          <div className="pt-5 pb-10 text-sm text-center text-zinc-700 dark:text-zinc-300">
            No announcements {announcementData.length > 0 ? "found" : "so far"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
