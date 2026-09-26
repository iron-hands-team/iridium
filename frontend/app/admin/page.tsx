import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { FaBasketball, FaUserGear } from "react-icons/fa6";
import { FaBook, FaBullhorn } from "react-icons/fa";
import NewAnnouncement from "@/components/admin/new-announcement";
import NewUser from "@/components/admin/new-user";
import Btn from "@/components/ui/btn";

const headingStyles = "text-xl font-bold flex items-center gap-x-3";

async function Page() {
  const { user } = await getSession();
  if (user.role !== "admin") redirect("/");

  return (
    <div className="px-50 py-10 flex justify-center gap-10 flex-wrap">
      <div className="flex-1 min-w-[40%] flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaUserGear size={18} /> User management
        </h2>
        <div className="border-1 border-zinc-800 p-4 flex flex-col gap-y-2">
          <Btn text="Manage users" link="/admin/users" primary />
          <NewUser styles="w-full" />
        </div>
      </div>
      <div className="flex-1 min-w-[40%] flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaBullhorn size={18} /> Announcement management
        </h2>
        <div className="border-1 border-zinc-800 p-4 flex flex-col gap-y-2">
          <NewAnnouncement full />
          <Btn text="View announcements" link="/admin/announcements" />
        </div>
      </div>
      <div className="flex-1 min-w-[40%] flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaBasketball size={18} /> Club management
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2 flex flex-col gap-y-2">
          <Btn text="Manage clubs" link="/admin/clubs" primary />
          <Btn text="Add club" />
        </div>
      </div>
      <div className="flex-1 min-w-[40%] flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaBook size={18} /> Class management
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2 flex flex-col gap-y-2">
          <Btn text="Manage classes" link="/admin/classes" primary />
          <Btn text="Add class" />
        </div>
      </div>
    </div>
  );
}

export default Page;
