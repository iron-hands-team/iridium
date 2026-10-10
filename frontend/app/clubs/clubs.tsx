"use client";

import type { ClubType } from "@/types/clubs";
import { useState } from "react";
import { FaCaretUp, FaFilter } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import DatePicker from "@/components/ui/date";
import ClubModal from "@/components/modals/club";

const types = ["All"];
const sorts = ["ID", "Name", "Description", "Sponsor", "Categories"];

function Clubs({ clubs }: { clubs: ClubType[] }) {
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<{ name: string; ascending: boolean }>({
    name: "",
    ascending: false,
  });
  const [type, setType] = useState<string>(types[0]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [club, setClub] = useState<ClubType | null>(null);
  const displayed = clubs
    .filter((c) =>
      [
        c.name,
        c.description,
        c.id,
        ...c.categories,
        c.sponsor?.lastName,
        c.sponsor?.firstName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    )
    .filter((c) => {
      return type === types[0] ? true : (c.categories || []).includes(type);
    })
    .sort((a, b) => {
      let res = 0;
      switch (sort.name) {
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
          res = (a.categories || [])
            .join(", ")
            .localeCompare((b.categories || []).join(", "));
          break;
      }
      return (sort.ascending ? -1 : 1) * res;
    });

  return (
    <div>
      <div className="flex flex-col gap-y-1">
        Select date
        <div>
          <DatePicker date={date} setDate={(d) => setDate(d)} />
        </div>
      </div>
      <div className="flex gap-x-10 items-center py-5">
        <Input
          placeholder="Search clubs"
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
      <div className="flex">
        {sorts.map((s, i) => {
          return (
            <div
              key={s}
              className={`${i === 0 ? "flex-1" : i % 2 !== 0 ? "flex-2" : "flex-4"} cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3`}
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
      <div className="border-t border-zinc-800 h-[calc(100vh-365px)] overflow-y-auto">
        {displayed.length > 0 ? (
          displayed.map((d) => (
            <div
              key={d.id}
              className="pl-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer flex gap-x-4 items-center"
              onClick={() => setClub(d)}
            >
              <div className="flex-1 px-1">{d.id}</div>
              <div className="flex-2 px-1">{d.name}</div>
              <div className="flex-4 px-1">
                {d.description
                  ? d.description.slice(0, 100) +
                    (d.description.length > 100 ? "..." : "")
                  : "-"}
              </div>
              <div className="flex-2 px-1">
                {d.sponsor
                  ? d.sponsor.lastName + ", " + d.sponsor.firstName
                  : "-"}
              </div>
              <div className="flex-4 px-1">{d.categories.join(", ")}</div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-sm">
            No clubs found. Try a different search?
          </div>
        )}
      </div>
      <AnimatePresence>
        {club && <ClubModal club={club} closeModal={() => setClub(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default Clubs;
