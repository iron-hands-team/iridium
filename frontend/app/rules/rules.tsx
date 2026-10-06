"use client";

import type { RuleType } from "@/lib/schemas";
import { useState } from "react";
import Input from "@/components/ui/input";

function Rules({ rules }: { rules: RuleType[] }) {
  const [search, setSearch] = useState<string>("");
  const displayed = rules.filter((r) =>
    [r.id, r.name, r.description]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <div className="w-100">
        <Input
          placeholder={`Search rules (${rules.length})`}
          value={search}
          setValue={(s) => setSearch(s)}
          clear
        />
      </div>
      {displayed.length > 0 ? (
        displayed.map((rule) => (
          <div key={rule.id} className="border border-zinc-800 p-5">
            <div className="text-sm">Rule #{rule.id}</div>
            <h2 className="font-bold text-xl my-1">{rule.name}</h2>
            {rule.description && (
              <p className="text-zinc-700 dark:text-zinc-300 text-sm mt-3">
                {rule.description}
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="text-zinc-700 dark:text-zinc-300 py-10 text-center text-sm">
          {rules.length > 0
            ? "No rules found. Try a different search?"
            : "No rules added, you can do whatever you want!"}
        </div>
      )}
    </>
  );
}

export default Rules;
