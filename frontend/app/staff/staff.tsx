"use client";

import type { UserType } from "@/types/user";
import { useState } from "react";
import { profileUrl } from "@/lib/helpers";
import { FaUserCircle } from "react-icons/fa";
import MessageBtn from "@/components/chat/message-btn";
import Input from "@/components/ui/input";
import Image from "next/image";

function Staff({ users }: { users: UserType[] }) {
  const [search, setSearch] = useState<string>("");
  const displayed = users.filter((u) =>
    [u.firstName, u.middleName, u.lastName, u.username, u.title]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-y-5">
      <div className="w-100">
        <Input
          placeholder="Search staff"
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
      </div>
      {/* TODO: add filters and more viewing options */}
      <div>
        <div className="pl-4 py-2 flex gap-x-3 items-center font-bold border-b border-zinc-800">
          <div className="w-10" />
          <div className="flex-1 px-4">Username</div>
          <div className="flex-2 px-4">Name</div>
          <div className="flex-2 px-4">Title</div>
          <div className="flex-1 px-4">Role</div>
          <div className="flex-1 px-4">Action</div>
        </div>
        {displayed.length > 0 ? (
          displayed.map((u) => (
            <div
              key={u.id}
              className="pl-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer flex gap-x-3 items-center"
            >
              <div className="flex justify-center w-10">
                {u.image ? (
                  <Image
                    src={profileUrl(u.username)}
                    alt="User avatar"
                    width={30}
                    height={30}
                    unoptimized
                  />
                ) : (
                  <FaUserCircle size={25} className="w-full" />
                )}
              </div>
              <div className="flex-1 px-4">
                {u.username.slice(0, 10) +
                  (u.username.length > 10 ? "..." : "")}
              </div>
              <div className="flex-2 px-4">
                {u.lastName}, {u.firstName}
              </div>
              <div className="flex-2 px-4">{u.title}</div>
              <div className="flex-1 px-4">
                {u.role[0].toUpperCase() + u.role?.slice(1)}
              </div>
              <div className="flex-1 px-4">
                <MessageBtn username={u.username} />
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-sm">
            No staff members found. Try a different search?
          </div>
        )}
      </div>
    </div>
  );
}

export default Staff;
