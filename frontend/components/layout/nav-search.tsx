"use client";

import type { SearchResponse } from "@/types/info";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  FaBullhorn,
  FaCalendar,
  FaUser,
  FaBasketballBall,
} from "react-icons/fa";
import SearchResult from "./search-result";
import Input from "../ui/input";

function NavSearch() {
  const [search, setSearch] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (search.trim().length > 0) {
      setResult(null);
      setSearching(true);
      const res: SearchResponse = await fetch(
        `/api/search?q=${search.trim().toLowerCase()}`,
      ).then((res) => res.json());
      setResult(res);
    }
  }

  useEffect(() => {
    setSearching(false);
  }, [pathname]);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) {
        setSearching(false);
      } else {
        setSearching(true);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 mx-2 relative"
      ref={searchRef}
    >
      <Input
        placeholder="Search Iridium"
        value={search}
        setValue={(s) => {
          setSearch(s);
          setSearching(false);
        }}
        clear
      />
      {searching && search.trim().length > 0 && (
        <div className="absolute top-full bg-zinc-200 dark:bg-zinc-900 w-full p-2 pt-4 pb-6 text-sm text-zinc-700 dark:text-zinc-300 text-center max-h-100 overflow-y-auto flex flex-col gap-y-2">
          {result ? (
            <>
              {result.announcements.length > 0 && (
                <>
                  <div className="font-bold text-left px-4">Announcements</div>
                  {result.announcements.map((a) => (
                    <SearchResult
                      key={a.id}
                      href="/"
                      name={a.title}
                      description={a.content}
                    >
                      <FaBullhorn size={18} />
                    </SearchResult>
                  ))}
                </>
              )}
              {result.clubs.length > 0 && (
                <>
                  <div className="font-bold text-left px-4">Clubs</div>
                  {result.clubs.map((c) => (
                    <SearchResult
                      key={c.id}
                      href={`/clubs/${c.id}`}
                      name={c.name}
                      description={c.description}
                    >
                      <FaBasketballBall size={18} />
                    </SearchResult>
                  ))}
                </>
              )}
              {result.events.length > 0 && (
                <>
                  <div className="font-bold text-left px-4">Events</div>
                  {result.events.map((e) => (
                    <SearchResult
                      key={e.id}
                      href="/calendar"
                      name={e.title}
                      description={e.description}
                    >
                      <FaCalendar size={18} />
                    </SearchResult>
                  ))}
                </>
              )}
              {result.users.length > 0 && (
                <>
                  <div className="font-bold text-left px-4">Users</div>
                  {result.users.map((u) => (
                    <SearchResult
                      key={u.id}
                      href={`/profile/${u.username}`}
                      name={u.first_name + " " + u.last_name}
                      description={u.username + " | " + u.title}
                    >
                      <FaUser size={18} />
                    </SearchResult>
                  ))}
                </>
              )}
              {result.announcements.length +
                result.clubs.length +
                result.events.length +
                result.users.length ===
                0 && "Nothing found. Try a different search?"}
            </>
          ) : (
            "Searching everything..."
          )}
        </div>
      )}
    </form>
  );
}

export default NavSearch;
