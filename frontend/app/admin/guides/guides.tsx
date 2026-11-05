"use client";

import type { GuideType } from "@/lib/schemas";
import { useState } from "react";
import { FaCaretUp } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import NewGuideModal from "@/components/modals/new-guide";
import Btn from "@/components/ui/btn";

const sorts = ["ID", "Title", "Description", "Label"];

function Guides({ guides }: { guides: GuideType[] }) {
  const [creating, setCreating] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [guide, setGuide] = useState<GuideType | null>(null);
  const [sort, setSort] = useState<{ name: string; ascending: boolean }>({
    name: sorts[1],
    ascending: false,
  });
  console.log(guides);
  const displayed = guides
    ?.filter((g) =>
      [g.id, g.title, g.description, g.label]
        .join(" ")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    )
    .sort((a, b) => {
      let res = 0;
      switch (sort.name) {
        case sorts[0]:
          res = a.id! - b.id!;
          break;
        case sorts[1]:
          res = a.title.localeCompare(b.title);
          break;
        case sorts[2]:
          res = (a.description || "").localeCompare(b.description || "");
          break;
        case sorts[3]:
          res = (a.label || "").localeCompare(b.label || "");
          break;
      }
      return (sort.ascending ? -1 : 1) * res;
    });

  return (
    <div className="flex flex-col gap-y-5">
      <Btn
        text="Add guide"
        onclick={() => setCreating(true)}
        styles="w-fit"
        primary
      />
      <div className="flex gap-x-10 items-center">
        <Input
          placeholder={`Search guides (${guides.length})`}
          value={search}
          setValue={(s) => setSearch(s)}
          styles="w-100!"
          clear
        />
      </div>
      <div>
        <div className="flex">
          {sorts.map((s, i) => {
            return (
              <div
                key={s}
                className={`${i === 0 || i === 3 ? "flex-1" : i === 2 ? "flex-3" : "flex-2"} cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3`}
                onClick={() =>
                  setSort({
                    ascending: sort.name === s ? !sort.ascending : false,
                    name: s,
                  })
                }
              >
                {s}
                {sort.name === s && i !== 6 && (
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
            displayed.map((g) => {
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-x-8 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer text-sm py-2 px-4"
                  onClick={() => setGuide(g)}
                >
                  <div className="flex-1">{g.id}</div>
                  <div className="flex-2">{g.title}</div>
                  <div className="flex-3">
                    {g.description
                      ? g.description.slice(0, 55) +
                        (g.description.length > 55 ? "..." : "")
                      : "-"}
                  </div>
                  <div className="flex-1">{g.label || "-"}</div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-sm text-zinc-700 dark:text-zinc-300 py-10">
              No guides found. Try a different search?
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {(guide || creating) && (
          <NewGuideModal
            existing={guide || undefined}
            closeModal={() => {
              setGuide(null);
              setCreating(false);
            }}
            toast={(m) => toast.success(m)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Guides;
