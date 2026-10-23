"use client";

import type { FileType, FileOptionType } from "@/lib/schemas";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { fileUrl } from "@/lib/helpers";
import { fileOptions } from "@/lib/schemas";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Image from "next/image";
import Link from "next/link";

interface FilesProps {
  files: FileType[];
  isAdmin: boolean;
}

function Files({ files, isAdmin }: FilesProps) {
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<FileOptionType>("All");
  const displayed = files.filter(
    (f) =>
      (type === "All" || f.type === type) &&
      (f.title + f.description)
        .trim()
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );

  return (
    <div>
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
            setValue={(t) => setType(t as FileOptionType)}
            values={fileOptions}
            label="File type"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-5">
        {displayed.length > 0 ? (
          displayed.map((file) => (
            <div
              key={file.id}
              className="w-80 border border-zinc-800 flex flex-col gap-y-3 p-5 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <Image
                src={fileUrl(file.id as number, false)}
                alt="Uploaded file"
                width={150}
                height={150}
                unoptimized
              />
              <div className="text-lg font-bold">{file.title}</div>
              {file.description && (
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {file.description}
                </p>
              )}
              <div className="px-2 py-1.5 w-fit bg-zinc-300/50 dark:bg-zinc-800/50 text-sm text-zinc-700 dark:text-zinc-300">
                {file.type}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm py-3 text-zinc-700 dark:text-zinc-300">
            {files.length > 0 ? (
              "No files found. Try a different search?"
            ) : (
              <>
                No files have been uploaded yet.{" "}
                {isAdmin && (
                  <Link href="/admin" className="underline">
                    Go to edit files page
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
