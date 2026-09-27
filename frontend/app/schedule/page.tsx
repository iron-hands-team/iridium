import { redirect } from "next/navigation";
import { FaClock } from "react-icons/fa";
import { getSession } from "@/lib/auth";

interface ScheduleItem {
  id: number;
  period: number;
  course_name: string;
  room: string | null;
  start_time: string | null;
  end_time: string | null;
}

function formatTime(t: string | null) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

async function Page() {
  const { user, cookie } = await getSession();
  if (!user) redirect("/");

  const schedule: ScheduleItem[] = await fetch(
    `${process.env.INTERNAL_API_URL}/schedule/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  ).then((res) => res.json());

  return (
    <div className="px-50 py-10 flex flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaClock size={18} /> Schedule
      </h2>
      {schedule.length === 0 ? (
        <div className="text-sm text-center text-zinc-700 dark:text-zinc-300 py-10">
          No schedule items to show yet.
        </div>
      ) : (
        <div className="flex flex-col">
          {schedule.map((item) => {
            const start = formatTime(item.start_time);
            const end = formatTime(item.end_time);
            return (
              <div
                key={item.id}
                className="flex items-center gap-x-6 border-b border-zinc-800 px-4 py-3"
              >
                <div className="w-20 text-sm text-zinc-500">
                  Period {item.period}
                </div>
                <div className="flex-1 font-bold">{item.course_name}</div>
                <div className="text-sm text-zinc-500">
                  {item.room && <>{item.room} &middot; </>}
                  {start && end
                    ? `${start} - ${end}`
                    : start || end || ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Page;