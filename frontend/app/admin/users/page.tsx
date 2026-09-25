import type { UserType } from "@/lib/auth";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import Users from "./users";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user } = await getSession();
  if (!user.isAdmin) redirect("/");

  const params = await searchParams;
  const type = params.t;
  if (type && type !== "s" && type !== "t" && type !== "a") redirect("/admin");

  const role =
    type === "s"
      ? "student"
      : type === "t"
        ? "teacher"
        : type === "a"
          ? "admin"
          : "all";

  const cookieStore = await cookies();
  const authToken = cookieStore.get("access-token");

  const res = await fetch(
    `${process.env.INTERNAL_API_URL}/users?role=${role}`,
    {
      headers: {
        Authorization: `Bearer ${authToken?.value}`,
      },
      cache: "no-store",
    },
  );

  const rawUsers = res.ok ? await res.json() : [];
  const users: UserType[] = rawUsers.map((u: any) => ({
    id: u.username,
    lastName: u.last_name,
    firstName: u.first_name,
    middleName: u.middle_name,
    role: u.role,
    isAdmin: u.role === "admin",
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
