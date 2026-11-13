"use client";

import { useState } from "react";
import { cls } from "@/lib/clubStore";
import Btn from "@/components/ui/btn";

export default function SelectionControlBar() {
  const setSelectionControlBar = cls((state) => state.setSelectionControlBar);

  const clubs = cls((state) => state.clubs);
  const selection = cls((state) => state.selection);

  const deleteEverythingSelection = cls(
    (state) => state.deleteEverythingSelection,
  );

  const deleteClub = cls((state) => state.deleteClub);

  const [position, setPosition] = useState({ x: 100, y: 100 });

  function deleteEverything() {
    clubs.map((clubItem) => {
      if (selection.includes(clubItem.id)) {
        deleteClub(clubItem.id);
      }
      deleteEverythingSelection();
    });
  }

  return (
    <div
      style={{ position: "fixed", left: position.x, top: position.y }}
      onMouseDown={(e) => {
        const offsetX = e.clientX - position.x;
        const offsetY = e.clientY - position.y;

        const move = (e: MouseEvent) => {
          setPosition({
            x: e.clientX - offsetX,
            y: e.clientY - offsetY,
          });
        };
        const stop = () => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", stop);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", stop);
      }}
      className="fixed flex w-100 justify-start items-start bg-zinc-200/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-y-auto flex-col flex-wrap z-100 border-1 border-zinc-800  shadow-[0_4px_10px_rgba(0,0,0,0.5)] cursor-grab p-[10px]"
      onClick={() => setSelectionControlBar(false)}
    >
      <div className="flex items-center gap-[10px] ">
        <b className="text-xl">Bulk Selector </b>
        <b>({selection.length} selected)</b>
      </div>
      <div className="flex gap-[10px] flex-1 w-full justify-center my-3">
        <Btn
          onclick={() => deleteEverything()}
          text={"Delete " + selection.length}
          styles="text-sm bg-red-500! border-red-500! text-white!"
          primary
        />
        <Btn
          onclick={() => {
            deleteEverythingSelection();
          }}
          text={"Unselect " + selection.length}
        />
      </div>
    </div>
  );
}
