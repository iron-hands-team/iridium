"use client";

import { useState } from "react";
import { cls } from "@/lib/clubStore";
import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";
import TagsSystemPopup from "@/components/club/clubTagsSystem";
import ClubManagerSystem from "@/components/club/clubManagerSystem";
import ClubBar from "@/components/club/clubBar";
import SelectionControlBar from "@/components/club/selectionControlBar";
import Settings from "@/components/club/clubSettings";
import { AnimatePresence } from "framer-motion";

export default function ClubTeacherBody() {
  const clubs = cls((s) => s.clubs);

  const selection = cls((state) => state.selection);

  const addSelection = cls((state) => state.addSelection);
  const deleteEverythingSelection = cls(
    (state) => state.deleteEverythingSelection,
  );

  const settings = cls((state) => state.settings);
  const setSettings = cls((state) => state.setSettings);

  const canEditTags = cls((s) => s.canEditTags);
  const setCanEditTags = cls((s) => s.setCanEditTags);

  const addClub = cls((s) => s.addClub);

  const clubTargetIndex = cls((s) => s.clubTargetIndex);

  const [searchClubInput, setSearchClubInput] = useState("");

  const canViewAll = cls((state) => state.canViewAll);
  const setCanViewAll = cls((state) => state.setCanViewAll);

  const canViewBookMarks = cls((state) => state.canViewBookMarks);

  function isOneSelected() {
    return selection.length > 0;
  }

  function totalMember() {
    let total = 0;
    clubs.map((clubItem) => {
      total += clubItem.students.length + clubItem.managers.length;
    });
    return total;
  }

  async function handleSave() {
    console.log(clubs);
  }

  return (
    <div className="flex items-start justify-start flex-col">
      <div className="flex w-full h-full justify-start items-start">
        <div
          className={`flex flex-col h-full  ${clubTargetIndex == -1 ? "w-full" : "w-2/3"} justify-start`}
        >
          <div className="flex flex-col overflow-y-auto flex-1 justify-start">
            <div className="flex w-full gap-[10px] items-center p-[10px] justify-start">
              <div className="w-2/3">
                <Input
                  value={searchClubInput}
                  setValue={(e) => setSearchClubInput(e)}
                  placeholder="Enter Club Name or ID..."
                />
              </div>
            </div>
            <div className="flex w-full items-center p-[10px] justify-start gap-[100px]">
              <div className="flex gap-[10px]">
                <Btn onclick={handleSave} text="Save" primary />
                <Btn
                  onclick={() => {
                    addClub();
                    setSearchClubInput("");
                    setCanViewAll(true);
                  }}
                  text="Add Club"
                />
                <Btn
                  onclick={() => {
                    setCanEditTags(true);
                  }}
                  text="Manage Tags"
                />
                <Btn onclick={() => setSettings(true)} text="Settings" />
                <Btn
                  onclick={() => {
                    if (isOneSelected()) {
                      deleteEverythingSelection();
                    } else {
                      clubs.map((clubItem) => {
                        addSelection(clubItem.id);
                      });
                    }
                  }}
                  text={isOneSelected() ? "Deselect" : "Select All"}
                />
              </div>
            </div>

            <ClubBar clubIndex={-1} text="Bookmarked" />
            {canViewBookMarks &&
              clubs.map(
                (clubItem, clubIndex) =>
                  clubItem.isBookedMarked && (
                    <ClubBar key={clubIndex} clubIndex={clubItem.id} text="" />
                  ),
              )}

            <div
              className="flex w-full h-[50px] justify-between items-center cursor-pointer p-[10px] gap-[10px] border-b-1 border-zinc-800"
              onClick={() => setCanViewAll(!canViewAll)}
            >
              <b>All ({clubs.length}) </b>
              Total Members: {totalMember()}
            </div>
            {canViewAll &&
              clubs.map(
                (clubItem, clubIndex) =>
                  (clubItem.name
                    .toLowerCase()
                    .includes(searchClubInput.toLowerCase()) ||
                    clubItem.id
                      .toString()
                      .includes(searchClubInput.toLowerCase())) &&
                  !clubItem.isBookedMarked && (
                    <ClubBar key={clubIndex} clubIndex={clubItem.id} text="" />
                  ),
              )}
          </div>
        </div>
        {clubTargetIndex != -1 && <ClubManagerSystem />}
      </div>
      <AnimatePresence>{settings && <Settings />}</AnimatePresence>
      <AnimatePresence>{canEditTags && <TagsSystemPopup />}</AnimatePresence>
      {selection.length > 0 && <SelectionControlBar />}
    </div>
  );
}
