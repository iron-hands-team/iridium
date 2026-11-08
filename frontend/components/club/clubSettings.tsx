"use client";

import { cls } from "@/lib/clubStore";
import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";

export default function ClubSettings() {
  const setSettings = cls((s) => s.setSettings);

  const clubBarHeight = cls((s) => s.clubBarHeight);
  const setClubBarHeight = cls((s) => s.setClubBarHeight);

  const fontSize = cls((s) => s.fontSize);
  const setFontSize = cls((s) => s.setFontSize);

  const deleteEverythingClub = cls((s) => s.deleteEverythingClub);
  const deleteEverythingTag = cls((s) => s.deleteEverythingTag);

  return (
    <div
      className="fixed inset-0 flex h-full w-full justify-center items-center bg-black/90"
      onClick={() => setSettings(false)}
    >
      <div
        className="h-[750px] w-3/4 z-10 overflow-y-auto flex flex-col justify-start items-start border-1 border-zinc-400 bg-black  p-[10px] relative gap-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[30px]">
          <b>Settings!</b>
        </p>
        <button
          onClick={() => setSettings(false)}
          className="absolute top-5 right-5 p-[10px] border-1 border-zinc-600"
        >
          <p>Exit</p>
        </button>
        <br></br>
        <p>
          <b>Customization:</b>
        </p>
        <div className="flex items-center gap-[10px]">
          <p>
            <b>Club Bar Height:</b>
          </p>
          <Input
            value={clubBarHeight.toString()}
            setValue={(e) => setClubBarHeight(Number(e))}
            placeholder={"Set Club Bar Height"}
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <p>
            <b>Font Size: </b>
          </p>
          <Input
            value={fontSize.toString()}
            setValue={(e) => setFontSize(Number(e))}
            placeholder={"Set Font Size"}
          />
        </div>
        <br></br>
        <p>
          <b>Spooky Scary Danger Zone</b>
        </p>
        <div className="flex items-center gap-[10px]">
          <Btn onclick={() => deleteEverythingClub()} text="Clear Clubs" />
        </div>
        <div className="flex items-center gap-[10px]">
          <Btn onclick={() => deleteEverythingTag()} text="Clear Tags" />
        </div>
      </div>
    </div>
  );
}
