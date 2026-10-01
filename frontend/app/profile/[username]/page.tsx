import type { UserResponse } from "@/types/user";
import { getSession } from "@/lib/auth";
import { parseUser } from "@/lib/helpers";
import { notFound } from "next/navigation";
import { FaUser } from "react-icons/fa";
import Edit from "@/components/profile/edit";
import Avatar from "@/components/profile/avatar";

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { user: currentUser, cookie } = await getSession();

  const userData: UserResponse = await fetch(
    `${process.env.INTERNAL_API_URL}/users/${username}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  ).then((res) => res.json());
  if (!userData.username) notFound();
  const user = parseUser(userData);

  return (
    <div className="flex gap-x-10 px-50 py-10">
      <div className="border border-zinc-800 w-70 flex flex-col gap-y-5 p-5 text-sm">
        <Avatar
          image={user.image}
          canEdit={
            currentUser.role === "admin" ||
            currentUser.username === user.username
          }
        />
        <h1 className="text-black dark:text-white font-bold text-xl">
          {user.firstName} {user.middleName} {user.lastName}
        </h1>
        <div>Username: {user.username}</div>
        <div>Role: {user.role[0].toUpperCase() + user.role.slice(1)}</div>
        <div>ID: {user.id}</div>
        {currentUser.role === "admin" && <Edit user={user} />}
      </div>
      <div className="flex-1 flex flex-col gap-y-5">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          <FaUser size={20} /> About {user.firstName}
        </h2>
        <div className="text-center text-zinc-700 dark:text-zinc-300 text-sm py-5">
          More stuff coming soon!
        </div>
      </div>
    </div>
  );
}

export default Page;
