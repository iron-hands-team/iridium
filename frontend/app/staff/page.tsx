import type { Metadata } from "next";
import type { UserType, UserResponse } from "@/types/user";
import { parseUser } from "@/lib/helpers";
import { FaUserAstronaut } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import Staff from "./staff";

export const metadata: Metadata = {
  title: "Staff Directory",
  description:
    "Browse your school's complete staff directory of teachers and admins, view their information and classes, and message them.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Staff Directory",
    description:
      "Browse your school's complete staff directory of teachers and admins, view their information and classes, and message them.",
    url: "https://iridium.tonymac.net/staff",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { cookie } = await getSession();
  const userData = await fetch(`${process.env.INTERNAL_API_URL}/users/staff`, {
    headers: {
      Authorization: `Bearer ${cookie.value}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  const users: UserType[] = userData.map((u: UserResponse) => parseUser(u));

  return (
    <div className="px-50 flex py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto pb-10">
      <div className="flex-1 flex flex-col gap-y-5">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          <FaUserAstronaut size={18} /> Staff
        </h2>
        <Staff users={users} />
      </div>
    </div>
  );
}

export default Page;
