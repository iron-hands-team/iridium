import { redirect } from "next/navigation";
import type { StudentClassGradesType } from "@/types/grade";
import { getSession } from "@/lib/auth";

async function Page() {
  const { user, cookie } = await getSession();
  if (!user) redirect("/");
  if (user.role !== "student") redirect("/classes");

  const classGrades: StudentClassGradesType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/grades/me`,
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
      <h2 className="text-xl font-bold">Grades</h2>
      {classGrades.length === 0 ? (
        <p className="text-sm text-zinc-500">
          You're not enrolled in any classes with a gradebook yet.
        </p>
      ) : (
        classGrades.map((cls) => {
          const graded = cls.assignments.filter((a) => a.score !== null);
          const average =
            graded.length > 0
              ? (
                  (graded.reduce(
                    (sum, a) => sum + (a.score || 0) / a.max_score,
                    0,
                  ) /
                    graded.length) *
                  100
                ).toFixed(1)
              : null;
          return (
            <div
              key={cls.class_id}
              className="border border-zinc-800 rounded-lg p-4 flex flex-col gap-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{cls.class_name}</h3>
                {average && (
                  <span className="text-sm text-zinc-500">
                    Average: {average}%
                  </span>
                )}
              </div>
              {cls.assignments.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No assignments graded yet.
                </p>
              ) : (
                <div className="flex flex-col gap-y-1">
                  {cls.assignments.map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between items-center border-b border-zinc-800 py-1 text-sm"
                    >
                      <span>{a.name}</span>
                      <span className="text-zinc-500">
                        {a.score !== null ? a.score : "-"}/{a.max_score}
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