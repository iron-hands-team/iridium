import { redirect } from "next/navigation";
import { FaClock } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import ScheduleManager from "@/components/admin/schedule-manager";
import { div } from "framer-motion/client";

async function Page() {
    const {user} = await getSession();
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
        redirect("/");
    }

    return (
        <div className="px-50 py-10 flex flex-col gap-y-5">
            <h2 className="text-xl font-bold flex items-center gap-x-3">
                <FaClock size={18} /> Schedule management
            </h2>    
            <p className="text-sm text-zinc 700 dark:text zinc-300">
                Look up a student (or teacher) by username to add or remove periods from their schedule.
            </p>
            <ScheduleManager/>
        </div>        
    );
}

export default Page;