import type { Metadata } from "next";
import type { UserResponse, UserType } from "@/types/user";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import { parseUser } from "@/lib/helpers";
import Users from "./users";

export const metadata: Metadata = {
  title: "Manage Users",
  description:
    "View and browse detailed information and status for every user on Iridium, edit and manage them, and delete users here.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Manage Users",
    description:
      "View and browse detailed information and status for every user on Iridium, edit and manage them, and delete users here.",
    url: "https://iridium.tonymac.net/admin/users",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { user, cookie } = await getSession();
  if (user.role !== "admin") redirect("/");

  const res = await fetch(`${process.env.INTERNAL_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${cookie.value}`,
    },
    cache: "no-store",
  });

  const rawUsers = res.ok ? await res.json() : [];
  const users: UserType[] = rawUsers.map((u: UserResponse) => parseUser(u));

  return (
    <div className="px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaUsers size={18} /> View users
      </h2>
      <Users users={users} />
    </div>
  );
}

export default Page;
