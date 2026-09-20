"use client";

import type { UserType } from "@/lib/auth";
import { useState } from "react";
import { FaCaretUp, FaFilter } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import UserModal from "@/components/modals/user-modal";
import Dropdown from "@/components/ui/dropdown";

const sorts = ["ID", "Last name", "First name", "Middle name", "Admin"];
const types = ["All", "Students", "Teachers", "Admin"];

function Users({ users }: { users: UserType[] }) {
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<UserType | null>(null);
  const [type, setType] = useState<string>(types[0]);
  const [sort, setSort] = useState<{ name: string; ascending: boolean }>({
    name: sorts[1],
    ascending: false,
  });
  const displayed = users
    .filter(
      (u) =>
        [u.lastName, u.firstName, u.middleName]
          .join(" ")
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      //TODO: implement different user type and filter by dropdown selection
    )
    .sort((a, b) => {
      let res = 0;
      switch (sort.name) {
        case sorts[0]:
          res = a.id.localeCompare(b.id);
          break;
        case sorts[1]:
          res = a.lastName.localeCompare(b.lastName);
          break;
        case sorts[2]:
          res = a.firstName.localeCompare(b.firstName);
          break;
        case sorts[3]:
          res = (a.middleName || "z").localeCompare(b.middleName || "z");
          break;
        case sorts[4]:
          res = String(a.isAdmin).localeCompare(String(b.isAdmin));
          break;
      }
      return (sort.ascending ? -1 : 1) * res;
    });

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-10 items-center">
        <Input
          placeholder={`Search users (${users.length})`}
          value={search}
          setValue={(s) => setSearch(s)}
          styles="w-100!"
          clear
        />
        <div className="flex gap-x-3 items-center" title="Filter users by type">
          <FaFilter size={18} />
          <Dropdown
            value={type}
            setValue={(t) => setType(t)}
            values={types}
            label="User type"
          />
        </div>
      </div>
      <div>
        <div className="flex gap-x-5">
          {sorts.map((s, i) => {
            return (
              <div
                key={s}
                className={`${i === 4 || i === 0 ? "flex-1" : "flex-2"} cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3`}
                onClick={() =>
                  setSort({
                    ascending: sort.name === s ? !sort.ascending : false,
                    name: s,
                  })
                }
              >
                {s}
                {sort.name === s && (
                  <FaCaretUp
                    size={15}
                    className={`transition-transform! ${sort.ascending && "rotate-180"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="border-t border-zinc-800 h-[calc(100vh-325px)] overflow-y-auto">
          {displayed.length > 0 ? (
            displayed.map((u) => {
              return (
                <div
                  key={u.id}
                  className="flex gap-x-5 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
                  onClick={() => setUser(u)}
                >
                  <div className="flex-1 px-4">{u.id.slice(0, 8) + "..."}</div>
                  <div className="flex-2 px-4">{u.lastName}</div>
                  <div className="flex-2 px-4">{u.firstName}</div>
                  <div className="flex-2 px-4">{u.middleName || "-"}</div>
                  <div className="flex-1 px-4">{u.isAdmin ? "True" : "-"}</div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-sm text-zinc-700 dark:text-zinc-300 py-10">
              No users found. Try a different search?
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {user && <UserModal user={user} closeModal={() => setUser(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default Users;
