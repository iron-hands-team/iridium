import type {
  NotificationResponse,
  NotificationType,
} from "@/types/notification";
import { getSession } from "@/lib/auth";
import { parseNotification } from "@/lib/helpers";
import NavUser from "./nav-user";
import NavSearch from "./nav-search";
import Notifications from "./notifications";
import Link from "next/link";
import Image from "next/image";
import NavLinks, { type NavLink } from "./nav-links";

async function Nav() {
  const { user, cookie } = await getSession();

  const unreadCount =
    user && cookie
      ? await fetch(`${process.env.INTERNAL_API_URL}/messages/unread-count`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookie.value}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })
          .then((res) => res.json())
          .then((data) => data.count as number)
          .catch(() => 0)
      : 0;

  const enabled: string[] = await fetch(
    `${process.env.INTERNAL_API_URL}/settings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  )
    .then((res) => res.json())
    .then((data) => (data && data.id ? data.features : null));

  const [notificationsRaw, unreadNotificationCount]: [
    NotificationResponse[],
    number,
  ] =
    user && cookie
      ? await Promise.all([
          fetch(`${process.env.INTERNAL_API_URL}/notifications`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookie.value}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          })
            .then((res) => res.json())
            .catch(() => []),
          fetch(`${process.env.INTERNAL_API_URL}/notifications/unread-count`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookie.value}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          })
            .then((res) => res.json())
            .then((data) => data.count as number)
            .catch(() => 0),
        ])
      : [[], 0];

  const notifications: NotificationType[] =
    notificationsRaw.map(parseNotification);

  const links: NavLink[] = [
    ...(user.role === "admin" ? [{ href: "/admin", label: "Manage" }] : []),
    ...(user.role !== "student"
      ? [
          {
            href: "/classes",
            label: "Classes",
            displayed: enabled?.includes("Classes"),
          },
        ]
      : []),
    {
      href: "/schedule",
      label: "Schedule",
      displayed: enabled?.includes("Schedule"),
    },
    ...(user.role === "student"
      ? [
          { href: "/grades", label: "Grades" },
          { href: "/attendance", label: "Attendance" },
        ]
      : []),
    ...(user.role === "teacher"
      ? [{ href: "/admin/reports", label: "View reports" }]
      : []),
    {
      href: "/calendar",
      label: "Calendar",
      displayed: enabled?.includes("Calendar"),
    },
    { href: "/clubs", label: "Clubs", displayed: enabled?.includes("Clubs") },
    {
      href: "/messages",
      label: "Messages",
      badge: unreadCount,
      displayed: enabled?.includes("Messages"),
    },
    { href: "/chat", label: "Chat", displayed: enabled?.includes("Chat") },
  ];

  return (
    <div className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-950 border-b-1 border-zinc-800">
      <nav className="flex items-center gap-x-2 py-2 px-3 sm:px-10 lg:px-50 max-w-450 mx-auto">
        <Link
          href="/"
          className="text-xl font-bold text-black dark:text-white mr-3 flex items-center gap-x-3"
        >
          <Image
            src="/logo.png"
            alt="Iridium Logo"
            width={27}
            height={27}
            className="invert-100 dark:invert-0"
          />
          Iridium
        </Link>
        <NavSearch />
        <NavLinks links={links} />
        <Notifications
          notifications={notifications}
          unreadCount={unreadNotificationCount}
        />
        <NavUser user={user} />
      </nav>
    </div>
  );
}
export default Nav;
