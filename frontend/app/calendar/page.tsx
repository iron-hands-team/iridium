import type { Metadata } from "next";
import type { EventType } from "@/types/event";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { FaCalendar } from "react-icons/fa";
import CalendarGrid from "@/components/calendar/calendar-grid";
import NewEvent from "@/components/admin/new-event";

export const metadata: Metadata = {
  title: "Event Calendar",
  description:
    "Browse the entire school year's calendar, search, create, or sign up for special events, and manage your personal schedule here.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Event Calendar",
    description:
      "Browse the entire school year's calendar, search, create, or sign up for special events, and manage your personal schedule here.",
    url: "https://iridium.tonymac.net/calendar",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  //TODO: search params to directly navigate to date
  const { user, cookie } = await getSession();
  if (!user) redirect("/");

  const events: EventType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/events`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  ).then((res) => res.json());

  const isStaff = user.role === "teacher" || user.role === "admin";

  return (
    <div className="px-50 py-10 flex flex-col gap-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          <FaCalendar size={18} /> Calendar
        </h2>
        {isStaff && <NewEvent />}
      </div>
      <CalendarGrid events={events} user={user} />
    </div>
  );
}

export default Page;
