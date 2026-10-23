import type { LinkType, PostType } from "@/lib/schemas";
import type { ScheduleItemType } from "@/types/schedule";
import type { EventType } from "@/types/event";
import { FaBell, FaBullhorn, FaCalendar, FaLink, FaMap } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import { mapUrl } from "@/lib/helpers";
import Announcement from "@/components/home/announcement";
import NewAnnouncement from "@/components/admin/new-announcement";
import EventCard from "@/components/calendar/event-card";
import Btn from "@/components/ui/btn";
import Link from "next/link";
import Image from "next/image";

const headingStyles = "text-xl font-bold flex items-center gap-x-3";
const linkStyles = "text-sm hover:underline w-fit";

async function Page() {
  const { user, cookie } = await getSession();
  const announcementData: PostType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/announcements`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());
  const announcements = announcementData.sort((a, b) =>
    String(b.pinned).localeCompare(String(a.pinned)),
  );
  const mapRes = await fetch(`${process.env.INTERNAL_API_URL}/map`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.value}`,
      "Content-Type": "application/json",
    },
  });
  const mapData = await mapRes.json().catch(() => null);
  if (!mapRes.ok || !Array.isArray(mapData)) {
    console.error("Failed to load map items: ", mapRes.status, mapData);
  }
  const mapItems: string[] =
    mapRes.ok && Array.isArray(mapData)
      ? mapData.map((m: { label: string }) => m.label)
      : [];
  const linkRes = await fetch(`${process.env.INTERNAL_API_URL}/links`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.value}`,
      "Content-Type": "application/json",
    },
  });
  if (!linkRes.ok) console.error("Failed to load links: ", linkRes.status);
  const linkData: LinkType[] = linkRes.ok ? await linkRes.json() : [];
  const links = linkData.reduce(
    (acc: LinkType[][], l, i) => {
      acc[i % 2 === 0 ? 1 : 0] = [...acc[i % 2 === 0 ? 1 : 0], l];
      return acc;
    },
    [[], []],
  );

  const scheduleRes = await fetch(
    `${process.env.INTERNAL_API_URL}/schedule/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  );
  const scheduleData = await scheduleRes.json().catch(() => []);
  const scheduleItems: ScheduleItemType[] =
    scheduleRes.ok && Array.isArray(scheduleData) ? scheduleData : [];

  const eventsRes = await fetch(`${process.env.INTERNAL_API_URL}/events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.value}`,
      "Content-Type": "application/json",
    },
  });
  const eventsData = await eventsRes.json().catch(() => []);
  const upcomingEvents: EventType[] =
    eventsRes.ok && Array.isArray(eventsData)
      ? eventsData
          .filter((e: EventType) => new Date(e.start_time) >= new Date())
          .slice(0, 3)
      : [];

  return (
    <div className="px-50 flex py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto pb-10">
      <div className="flex-1 flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaBullhorn size={18} /> Announcements
        </h2>
        {user.role === "admin" && (
          <div className="flex gap-x-3">
            <NewAnnouncement text="New post" />
            <Btn text="Manage posts" link="/admin/announcements" />
          </div>
        )}
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
            No announcements so far
          </div>
        )}
      </div>
      <div className="flex flex-col gap-y-5 w-70">
        <h2 className={headingStyles}>
          <FaBell size={18} /> Schedule
        </h2>
        {scheduleItems.length > 0 ? (
          <div className="border-1 border-zinc-800 flex flex-col">
            {scheduleItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-4 py-2 border-b border-zinc-800 last:border-b-0 text-sm"
              >
                <div>
                  <span className="font-bold">P{item.period}</span>{" "}
                  {item.course_name}
                  {item.room && (
                    <span className="text-zinc-500"> &middot; {item.room}</span>
                  )}
                </div>
                {item.start_time && (
                  <span className="text-xs text-zinc-500">
                    {item.start_time}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-1 border-zinc-800 px-4 py-2 text-sm text-zinc-500 text-center">
            No schedule set
          </div>
        )}
        <h2 className={headingStyles}>
          <FaCalendar size={18} /> Calendar
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="flex flex-col gap-y-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} user={user} />
            ))}
          </div>
        ) : (
          <div className="border-1 border-zinc-800 px-4 py-2 text-sm text-zinc-500 text-center">
            No upcoming events
          </div>
        )}
        <Link href="/calendar" className={linkStyles}>
          View full calendar
        </Link>
        <h2 className={headingStyles}>
          <FaLink size={18} /> Links
        </h2>
        <div className="border-1 border-zinc-800 p-4 flex">
          <div className="flex w-[50%] flex-col gap-y-3">
            <Link href="/rules" className={linkStyles}>
              School rules
            </Link>
            <Link href="/staff" className={linkStyles}>
              Staff directory
            </Link>
            {links[1].map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className={linkStyles}
                target={l.blank ? "_blank" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex w-[50%] flex-col gap-y-3">
            <Link href={`/profile/${user.username}`} className={linkStyles}>
              Profile
            </Link>
            <Link href="/files" className={linkStyles}>
              Files
            </Link>
            {links[0].map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className={linkStyles}
                target={l.blank ? "_blank" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        {mapItems.length > 0 && (
          <>
            <h2 className={headingStyles}>
              <FaMap size={18} /> Map
            </h2>
            <div className="flex flex-col items-center gap-y-10">
              {mapItems.map((m, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-y-3 items-center text-sm text-zinc-700 dark:text-zinc-300"
                >
                  <Image
                    src={mapUrl(i)}
                    alt="Map item"
                    className="w-full"
                    width={500}
                    height={500}
                    unoptimized
                  />
                  {m}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
