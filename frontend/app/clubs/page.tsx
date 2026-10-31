import type { Metadata } from "next";
import type { ClubResponse, ClubType } from "@/types/clubs";
import { FaBasketball } from "react-icons/fa6";
import { getSession } from "@/lib/auth";
import { parseUser } from "@/lib/helpers";
import Clubs from "./clubs";

export const metadata: Metadata = {
  title: "Clubs",
  description:
    "View and browse all the different clubs offered by your school on each date, join, edit, or leave them, and access each club's own page.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Clubs",
    description:
      "View and browse all the different clubs offered by your school on each date, join, edit, or leave them, and access each club's own page.",
    url: "https://iridium.tonymac.net/clubs",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};                                                                                      
async function Page() {
  const { cookie } = await getSession();
  const clubs: ClubType[] = (
    await fetch(`${process.env.INTERNAL_API_URL}/clubs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  ).map((c: ClubResponse) => {
    return c.sponsor
      ? { ...c, sponsor: parseUser(c.sponsor), sponsorId: c.sponsor_id }
      : c;
  });

  return (
    <div className="px-50 flex py-10 pb-10 flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBasketball size={18} /> Clubs
      </h2>
      <Clubs clubs={clubs} />
    </div>
  );
}
export default Page;