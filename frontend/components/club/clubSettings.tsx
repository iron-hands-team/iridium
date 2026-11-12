"use client";

import { cls } from "@/lib/clubStore";
import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";
import Modal from "../ui/modal";

const labelStyles = "text-sm flex flex-col gap-y-1";

export default function ClubSettings() {
  const setSettings = cls((s) => s.setSettings);

  const clubBarHeight = cls((s) => s.clubBarHeight);
  const setClubBarHeight = cls((s) => s.setClubBarHeight);

  const fontSize = cls((s) => s.fontSize);
  const setFontSize = cls((s) => s.setFontSize);

  const deleteEverythingClub = cls((s) => s.deleteEverythingClub);
  const deleteEverythingTag = cls((s) => s.deleteEverythingTag);

  return (
    <Modal closeModal={() => setSettings(false)}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">Appearance settings</h2>
        <label className={labelStyles}>
          Bar height
          <Input
            value={clubBarHeight.toString()}
            setValue={(e) => setClubBarHeight(Number(e))}
            placeholder={"Set Club Bar Height"}
          />
        </label>
        <label className={labelStyles}>
          Font size
          <Input
            value={fontSize.toString()}
            setValue={(e) => setFontSize(Number(e))}
            placeholder={"Set Font Size"}
          />
        </label>
        <Btn
          onclick={() => deleteEverythingClub()}
          text="Clear Clubs"
          styles="text-sm bg-red-500! border-red-500! text-white! w-fit"
          primary
        />
        <Btn
          onclick={() => deleteEverythingTag()}
          text="Clear Tags"
          styles="text-sm bg-red-500! border-red-500! text-white! w-fit"
          primary
        />
        <Btn
          onclick={() => setSettings(false)}
          text="Save"
          styles="w-fit"
          primary
        />
      </div>
    </Modal>
  );
}
