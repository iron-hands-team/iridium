import type { ClubResponse, ClubType } from "@/types/clubs";
import { FaBasketball } from "react-icons/fa6";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { parseUser } from "@/lib/helpers";
import Clubs from "./clubs";

async function Page() {
  const { user, cookie } = await getSession();
  if (user.role !== "admin") redirect("/");
  const clubs: ClubType[] = (
    await fetch(`${process.env.INTERNAL_API_URL}/clubs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  ).map((c: ClubResponse) => {
    return c.sponsor ? { ...c, sponsor: parseUser(c.sponsor) } : c;
  });

  return (
    <div className="px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBasketball size={18} /> View clubs
      </h2>
      <Clubs clubs={clubs} />
    </div>
  );
}

export default Page;
