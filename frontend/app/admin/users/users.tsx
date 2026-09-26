"use client";

import type { UserType } from "@/types/user";
import { useState } from "react";
import { FaCaretUp, FaFilter } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { roles } from "@/lib/constants";
import Input from "@/components/ui/input";
import UserModal from "@/components/modals/user";
import Dropdown from "@/components/ui/dropdown";
import NewUser from "@/components/admin/new-user";
import Checkbox from "@/components/ui/checkbox";

const sorts = ["Username", "Last name", "First name", "Middle name", "Role"];
const types = ["All", ...roles.map((r) => r[0].toUpperCase() + r.slice(1))];

function Users({ users }: { users: UserType[] }) {
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<UserType | null>(null);
  const [type, setType] = useState<string>(types[0]);
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<{ name: string; ascending: boolean }>({
    name: sorts[1],
    ascending: false,
  });
  const displayed = users
    .filter((u) =>
      [u.lastName, u.firstName, u.middleName, u.username]
        .join(" ")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    )
    .filter((u) => {
      return type === types[0] ? true : u.role === type.toLowerCase();
    })
    .sort((a, b) => {
      let res = 0;
      switch (sort.name) {
        case "selected":
          res = String(selected.includes(b.username)).localeCompare(
            String(selected.includes(a.username)),
          );
          break;
        case sorts[0]:
          res = a.username.localeCompare(b.username);
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
          res = a.role.localeCompare(b.role);
          break;
      }
      return (sort.ascending ? -1 : 1) * res;
    });

  //TODO: add multiselect bulk action

  return (
    <div className="flex flex-col gap-y-5">
      <NewUser primary />
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
        <div className="flex">
          <div
            className="w-12 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer flex items-center justify-center"
            onClick={() =>
              setSort({
                ascending: sort.name === "selected" ? !sort.ascending : false,
                name: "selected",
              })
            }
          >
            {sort.name === "selected" && (
              <FaCaretUp
                size={15}
                className={`transition-transform! ${sort.ascending && "rotate-180"}`}
              />
            )}
          </div>
          {sorts.map((s, i) => {
            return (
              <div
                key={s}
                className={`${i === 4 ? "flex-1" : "flex-2"} cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3`}
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
        <div className="border-t border-zinc-800 h-[calc(100vh-360px)] overflow-y-auto">
          {displayed.length > 0 ? (
            displayed.map((u) => {
              return (
                <div
                  key={u.username}
                  className="flex pl-4 gap-x-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <Checkbox
                    text=""
                    checked={selected.includes(u.username)}
                    setChecked={() =>
                      setSelected(
                        selected.includes(u.username)
                          ? selected.filter((s) => s !== u.username)
                          : [...selected, u.username],
                      )
                    }
                  />
                  <div className="flex flex-1" onClick={() => setUser(u)}>
                    <div className="flex-2 px-4">
                      {u.username.slice(0, 10) +
                        (u.username.length > 10 ? "..." : "")}
                    </div>
                    <div className="flex-2 px-4">{u.lastName}</div>
                    <div className="flex-2 px-4">{u.firstName}</div>
                    <div className="flex-2 px-4">{u.middleName || "-"}</div>
                    <div className="flex-1 px-4">
                      {u.role[0].toUpperCase() + u.role?.slice(1)}
                    </div>
                  </div>
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
