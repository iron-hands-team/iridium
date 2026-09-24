import type { PostType } from "@/lib/schemas";
import { cookies } from "next/headers";
import { FaBell, FaBullhorn, FaCalendar, FaLink } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import AnnouncementBar from "@/components/home/announcement-bar";
import Announcement from "@/components/home/announcement";

const headingStyles = "text-xl font-bold flex items-center gap-x-3";

async function Page() {
  const { user } = await getSession();
  const isAdmin = user?.isAdmin ? true : false;
  const cookieStore = await cookies();
  const authToken = cookieStore.get("access-token")!;
  const announcements: PostType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/announcements`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-50 flex py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto pb-10">
      <div className="flex-1 flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaBullhorn size={18} /> Announcements
        </h2>
        {isAdmin && <AnnouncementBar />}
        {announcements.length > 0 ? (
          announcements.map((announcement) => {
            return (
              <Announcement key={announcement.id} announcement={announcement} />
            );
          })
        ) : (
          <div className="pt-5 pb-10 text-sm text-center text-zinc-700 dark:text-zinc-300">
            No announcements so far
          </div>
        )}
      </div>
      <div className="flex flex-col gap-y-5 w-70 sticky top-0">
        <h2 className={headingStyles}>
          <FaBell size={18} /> Schedule
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2">
          <h2>Schedule</h2>
        </div>
        <h2 className={headingStyles}>
          <FaCalendar size={18} /> Calendar
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2">
          <h2>Events</h2>
        </div>
        <h2 className={headingStyles}>
          <FaLink size={18} /> Links
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2">
          <h2>Links</h2>
        </div>
      </div>
    </div>
  );
}

export default Page;
