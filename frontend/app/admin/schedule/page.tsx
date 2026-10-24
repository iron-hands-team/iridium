import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FaClock } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import ScheduleManager from "@/components/admin/schedule-manager";

export const metadata: Metadata = {
  title: "Manage Schedule",
  description:
    "Create and edit each individual user's (student or teacher) complete schedule and their class periods for each day here.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Manage Schedule",
    description:
      "Create and edit each individual user's (student or teacher) complete schedule and their class periods for each day here.",
    url: "https://iridium.tonymac.net/admin/schedule",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { user } = await getSession();
  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    redirect("/");
  }

  return (
    <div className="px-50 py-10 flex flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaClock size={18} /> Schedule management
      </h2>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        Look up a student (or teacher) by username to add or remove periods from
        their schedule.
      </p>
      <ScheduleManager />
    </div>
  );
}

export default Page;
