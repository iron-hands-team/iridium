import { redirect } from "next/navigation";
import type { StudentClassAttendanceType } from "@/types/attendance";
import { getSession } from "@/lib/auth";

const statusStyles: Record<string, string> = {
  present: "text-green-500",
  absent: "text-red-500",
  tardy: "text-yellow-500",
  excused: "text-zinc-400",
};

const statusLabels: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  tardy: "Tardy",
  excused: "Excused",
};

async function Page() {
  const { user, cookie } = await getSession();
  if (!user) redirect("/");
  if (user.role !== "student") redirect("/classes");

  const classAttendance: StudentClassAttendanceType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/attendance/me`,
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
      <h2 className="text-xl font-bold">Attendance</h2>
      {classAttendance.length === 0 ? (
        <p className="text-sm text-zinc-500">
          You&apos;re not enrolled in any classes yet.
        </p>
      ) : (
        classAttendance.map((cls) => {
          const total = cls.records.length;
          const present = cls.records.filter(
            (r) => r.status === "present",
          ).length;
          const rate =
            total > 0 ? ((present / total) * 100).toFixed(1) : null;
          return (
            <div
              key={cls.class_id}
              className="border border-zinc-800 rounded-lg p-4 flex flex-col gap-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{cls.class_name}</h3>
                {rate && (
                  <span className="text-sm text-zinc-500">
                    Present: {rate}%
                  </span>
                )}
              </div>
              {cls.records.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No attendance recorded yet.
                </p>
              ) : (
                <div className="flex flex-col gap-y-1">
                  {[...cls.records]
                    .reverse()
                    .map((r) => (
                      <div
                        key={r.date}
                        className="flex justify-between items-center border-b border-zinc-800 py-1 text-sm"
                      >
                        <span>{r.date}</span>
                        <span className={statusStyles[r.status] || ""}>
                          {statusLabels[r.status] || r.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Page;