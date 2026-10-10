import { redirect } from "next/navigation";
import type { EventType } from "@/types/event";
import { getSession } from "@/lib/auth";
import CalendarGrid from "@/components/calendar/calendar-grid";
import NewEvent from "@/components/admin/new-event";

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
        <h2 className="text-xl font-bold">Calendar</h2>
        {isStaff && <NewEvent />}
      </div>
      <CalendarGrid events={events} user={user} />
    </div>
  );
}

export default Page;
