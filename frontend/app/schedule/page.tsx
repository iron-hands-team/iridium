import { getSession } from "@/lib/auth";

async function Page() {
  const { cookie } = await getSession();
  const scheduleData = await fetch(
    `${process.env.INTERNAL_API_URL}/shedule/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-50 flex gap-x-10 py-10 pb-10">
      {!scheduleData ? (
        <div>hi</div>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">
              Periods
            </h2>
            <div className="w-full flex justify-between">8:40 - 10:15</div>
            <div className="w-full flex justify-between">10:25 - 12:00</div>
            <div className="w-full flex justify-between">12:00 - 12:40</div>
            <div className="w-full flex justify-between">12:40 - 2:15</div>
            <div className="w-full flex justify-between">2:25 - 4:00</div>
          </div>
          <div className="flex flex-col items-center gap-y-3 flex-1">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Monday
            </h2>
            <div>AP World History</div>
            <div>AP Seminar</div>
            <div>Lunch</div>
            <div>Engineering</div>
            <div>AP Precalculus BC</div>
          </div>

          <div className="flex flex-col items-center gap-y-3 flex-1">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Monday
            </h2>
            <div>AP World History</div>
            <div>AP Seminar</div>
            <div>Lunch</div>
            <div>Engineering</div>
            <div>AP Precalculus BC</div>
          </div>
          <div className="flex flex-col items-center gap-y-3 flex-1">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Monday
            </h2>
            <div>AP World History</div>
            <div>AP Seminar</div>
            <div>Lunch</div>
            <div>Engineering</div>
            <div>AP Precalculus BC</div>
          </div>
          <div className="flex flex-col items-center gap-y-3 flex-1">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Thursday
            </h2>
            <div>Chemistry Honors</div>
            <div>AP CS A+</div>
            <div>Lunch</div>
            <div>AP Biology</div>
            <div>AP Physics E&M</div>
          </div>
          <div className="flex flex-col items-center gap-y-3 flex-1">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Friday
            </h2>
            <div>AP World History</div>
            <div>AP Seminar</div>
            <div>Lunch</div>
            <div>Engineering</div>
            <div>AP Precalculus BC</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
