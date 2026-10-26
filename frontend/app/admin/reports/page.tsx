import type { Metadata } from "next";
import type { ReportResponse, ReportType } from "@/types/report";
import { FaFlag } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { parseUser } from "@/lib/helpers";
import Reports from "./reports";

export const metadata: Metadata = {
  title: "Manage Reports",
  description:
    "View and respond to different user-filed reports, dismiss them, and filter or organize them here.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Manage Reports",
    description:
      "View and respond to different user-filed reports, dismiss them, and filter or organize them here.",
    url: "https://iridium.tonymac.net/admin/reports",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { user, cookie } = await getSession();
  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    redirect("/");
  }

  const reports: ReportType[] = (
    await fetch(`${process.env.INTERNAL_API_URL}/reports`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }).then((res) => res.json())
  ).map((r: ReportResponse) => ({
    ...r,
    reporter: r.user ? parseUser(r.user) : null,
  }));

  return (
    <div className="px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaFlag size={18} /> View reports
      </h2>
      <Reports reports={reports} />
    </div>
  );
}

export default Page;
