"use client";

import type { ClubType } from "@/types/clubs";
import { useState, useEffect } from "react";
import { cls } from "@/lib/clubStore";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";
import TagsSystemPopup from "@/components/club/clubTagsSystem";
import ClubManagerSystem from "@/components/club/clubManagerSystem";
import ClubBar from "@/components/club/clubBar";
import SelectionControlBar from "@/components/club/selectionControlBar";
import Settings from "@/components/club/clubSettings";
import toast from "react-hot-toast";

export default function ClubTeacherBody({
  existing,
}: {
  existing?: ClubType[];
}) {
  const clubs = cls((s) => s.clubs);
  const setClubs = cls((s) => s.setClubs);

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

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    setError(null);
    const res = await fetch("/api/clubs/bulk", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clubs),
    });
    if (res.ok) {
      toast.success(`Clubs saved successfully!`);
      router.refresh();
    } else {
      setError(
        "Failed to save clubs. Please try again. (club names have to be unique)",
      );
    }
  }

  useEffect(() => {
    if (existing) {
      setClubs(
        existing.map((club: any) => ({
          id: club.id,
          name: club.name,
          desc: club.description,
          group: "",
          tags: club.tags,
          managers: club.managers,
          students: [],
          isBookedMarked: false,
          location: club.location,
          schedule: club.schedule,
        })),
      );
    }
  }, [existing, setClubs]);

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
            {error && (
              <div className="text-red-500 text-sm flex gap-x-3 items-center px-4 pt-1 pb-3">
                <FaExclamationTriangle size={15} /> {error}
              </div>
            )}
            <ClubBar clubIndex={-1} text="Bookmarked" />
            {canViewBookMarks &&
              clubs.map(
                (clubItem, clubIndex) =>
                  clubItem.isBookedMarked && (
                    <ClubBar key={clubIndex} clubIndex={clubIndex} text="" />
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
                    <ClubBar key={clubIndex} clubIndex={clubIndex} text="" />
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
