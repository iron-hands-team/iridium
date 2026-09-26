import type { ClubType } from "@/types/clubs";
import { FaBasketball } from "react-icons/fa6";
import { getSession } from "@/lib/auth";

async function Page() {
  const { cookie } = await getSession();
  const clubs: ClubType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/clubs`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-50 flex py-10 gap-x-15 overflow-y-auto pb-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBasketball size={18} /> Clubs
      </h2>
      <div>
        {clubs.map((club) => (
          <div key={club.id}>{club.name}</div>
        ))}
      </div>
    </div>
  );
}

export default Page;
