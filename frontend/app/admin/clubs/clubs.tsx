"use client";

import type { ClubCategory, ClubType } from "@/types/clubs";
import { useState } from "react";
import { FaCaretUp, FaFilter } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { categories } from "@/lib/constants";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Checkbox from "@/components/ui/checkbox";
import ClubModal from "@/components/modals/club";
import NewClub from "@/components/admin/new-club";
import { isReactCompilerRequired } from "next/dist/build/swc";
import { q } from "framer-motion/client";
import { FcMultipleSmartphones } from "react-icons/fc";
import { Ewert } from "next/font/google";

const types = ["All", ...categories];
const sorts = ["Id", "Name", "Description", "Sponsor", "Categories"];

function Clubs({ clubs }: { clubs: ClubType[] }) {
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>(types[0]);
  const [sort, setSort] = useState<{ name: string; ascending: boolean }>({
    name: sorts[0],
    ascending: false,
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [club, setClub] = useState<ClubType | null>(null);
  const displayed = clubs
    .filter((c) =>
      [c.id, c.name, c.description, c.sponsor?.lastName]
        .join(" ")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    )
    .filter((c) => {
      return type === types[0]
        ? true
        : (c.categories || []).includes(type as ClubCategory);
    })
    .sort((a, b) => {
      let res = 0;
      switch (sort.name) {
        case "selected":
          res = String(selected.includes(b.id)).localeCompare(
            String(selected.includes(a.id)),
          );
          break;
        case sorts[0]:
          res = a.id - b.id;
          break;
        case sorts[1]:
          res = a.name.localeCompare(b.name);
          break;
        case sorts[2]:
          res = (a.description || "z").localeCompare(b.description || "z");
          break;
        case sorts[3]:
          res = (a.sponsor?.lastName || "z").localeCompare(
            b.sponsor?.lastName || "z",
          );
          break;
        case sorts[4]:
          res = (a.categories || []).join(", ").localeCompare((b.categories || []).join(", "));
          break;
      }
      return (sort.ascending ? -1 : 1) * res;
    });

  return (
    <div className="flex flex-col gap-y-5">
      <NewClub />
      <div className="flex gap-x-10 items-center">
        <Input
          placeholder={`Search clubs (${clubs.length})`}
          value={search}
          setValue={(s) => setSearch(s)}
          styles="w-100!"
          clear
        />
        <div className="flex gap-x-3 items-center" title="Filter clubs by type">
          <FaFilter size={18} />
          <Dropdown
            value={type}
            setValue={(t) => setType(t)}
            values={types}
            label="Club type"
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
                className={`${i === 0 ? "flex-1" : "flex-2"} cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3`}
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
            displayed.map((c) => {
              return (
                <div
                  key={c.id}
                  className="flex pl-4 gap-x-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <Checkbox
                    text=""
                    checked={selected.includes(c.id)}
                    setChecked={() =>
                      setSelected(
                        selected.includes(c.id)
                          ? selected.filter((s) => s !== c.id)
                          : [...selected, c.id],
                      )
                    }
                  />
                  <div className="flex flex-1" onClick={() => setClub(c)}>
                    <div className="flex-1 px-4">{c.id}</div>
                    <div className="flex-2 px-4">{c.name}</div>
                    <div className="flex-2 px-4">{c.description || "-"}</div>
                    <div className="flex-2 px-4">
                      {c.sponsor?.lastName || "-"}
                    </div>
                    <div className="flex-2 px-4">
                      {c.categories ? c.categories.join(", ") : "-"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-sm text-zinc-700 dark:text-zinc-300 py-10">
              No clubs found. Try a different search?
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {club && <ClubModal club={club} closeModal={() => setClub(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default Clubs;
