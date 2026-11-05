"use client";

import type { GuideType } from "@/lib/schemas";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Btn from "@/components/ui/btn";

function Guides({ guides }: { guides: GuideType[] }) {
  const [guide, setGuide] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const displayed = guides.filter((g) =>
    [g.title, g.description]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        placeholder={`Search guides (${guides.length})`}
        value={search}
        styles="w-fit!"
        setValue={(s) => setSearch(s)}
      />
      {displayed.length > 0 ? (
        displayed.map((g, i) => (
          <div
            key={g.id}
            onClick={() => setGuide(i)}
            className="flex flex-col gap-y-3 p-5 border border-zinc-800 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900"
          >
            <h2 className="font-bold text-lg">{g.title}</h2>
            {g.description && (
              <div className="text-zinc-700 dark:text-zinc-300 text-sm">
                {g.description.slice(0, 100) +
                  (g.description.length > 100 ? "..." : "")}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-sm text-center py-5 text-zinc-700 dark:text-zinc-300">
          {guides.length > 0
            ? "No guides found. Try a different search?"
            : "No guides have been added yet :("}
        </div>
      )}
      <AnimatePresence>
        {guide !== null && (
          <Modal closeModal={() => setGuide(null)}>
            <div className="flex flex-col gap-y-3 p-5 text-sm text-zinc-700 dark:text-zinc-300">
              <h2 className="text-xl font-bold">{guides[guide].title}</h2>
              {guides[guide].label && (
                <div className="bg-zinc-300 dark:bg-zinc-900 w-fit px-2 py-1">
                  {guides[guide].label}
                </div>
              )}
              {guides[guide].description && (
                <div>{guides[guide].description}</div>
              )}
              <div className="flex flex-col gap-y-5">
                {guides[guide].sections.map((s, i) => (
                  <div key={i}>
                    <h2 className="mb-2 font-bold text-base">{s.subheading}</h2>
                    <div>{s.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-x-3">
                {guide !== 0 && (
                  <Btn text="Previous" onclick={() => setGuide(guide - 1)} />
                )}
                {guide !== guides.length - 1 && (
                  <Btn
                    text="Next"
                    onclick={() => setGuide(guide + 1)}
                    primary
                  />
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Guides;
