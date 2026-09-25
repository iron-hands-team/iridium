import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { FaBasketball, FaUserGear } from "react-icons/fa6";
import { FaBullhorn } from "react-icons/fa";
import NewAnnouncement from "@/components/admin/new-announcement";
import Btn from "@/components/ui/btn";

const headingStyles = "text-xl font-bold flex items-center gap-x-3";

async function Page() {
  const session = await getSession();
  if (!session.user.isAdmin) redirect("/");

  return (
    <div className="px-50 py-10 flex justify-center gap-10 flex-wrap">
      <div className="flex-1 min-w-[40%] flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaUserGear size={18} /> User management
        </h2>
        <div className="border-1 border-zinc-800 p-4 flex flex-col gap-y-2">
          <Btn text="View all" link="/admin/users" primary />
          <Btn text="View students" link="/admin/users?t=s" />
          <Btn text="View teachers" link="/admin/users?t=t" />
          <Btn text="View admin" link="/admin/users?t=a" />
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
      {/* <div className="flex-1 min-w-[40%] flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaBasketball size={18} /> Club management
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2 flex flex-col gap-y-2">
          <Btn text="Add clubs" link="/admin/c/add" />
          <Btn text="Edit clubs" link="/admin/c/edit" />
          <Btn text="View clubs" link="/admin/c/view" />
        </div>
      </div> */}
    </div>
  );
}

export default Page;
