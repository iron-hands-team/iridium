import type { UserResponse, UserType } from "@/types/user";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import Users from "./users";

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
  const users: UserType[] = rawUsers.map((u: UserResponse) => ({
    username: u.username,
    lastName: u.last_name,
    firstName: u.first_name,
    middleName: u.middle_name,
    role: u.role,
  }));

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
