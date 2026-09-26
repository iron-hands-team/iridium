import type { PostType } from "@/lib/schemas";
import { getSession } from "@/lib/auth";
import { FaBullhorn } from "react-icons/fa";
import { redirect } from "next/navigation";
import Announcements from "./announcements";

async function Page() {
  const { user, cookie } = await getSession();
  if (user.role !== "admin") redirect("/");
  const announcementData: PostType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/announcements`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());
  const announcements = announcementData.sort((a, b) =>
    String(b.pinned).localeCompare(String(a.pinned)),
  );

  return (
    <div className="px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBullhorn size={18} /> Manage announcements
      </h2>
      <Announcements announcementData={announcements} user={user} />
    </div>
  );
}

export default Page;
