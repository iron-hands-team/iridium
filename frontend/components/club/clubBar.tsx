"use client";

import { cls } from "@/lib/clubStore";

interface ClubBarInterface {
  clubIndex: number;
  text: string;
}

export default function ClubBar({ clubIndex, text }: ClubBarInterface) {
  const clubs = cls((state) => state.clubs);
  const setClub = cls((state) => state.setClub);
  const selection = cls((state) => state.selection);

  const setCanEdit = cls((s) => s.setCanEdit);

  const clubTargetIndex = cls((s) => s.clubTargetIndex);
  const setClubTargetIndex = cls((s) => s.setClubTargetIndex);

  const setCanViewBookMarks = cls((s) => s.setCanViewBookMarks);

  const addSelection = cls((state) => state.addSelection);
  const deleteSelection = cls((state) => state.deleteSelection);

  const clubBarHeight = cls((state) => state.clubBarHeight);

  function isInSelection() {
    return selection.includes(clubs[clubIndex].id);
  }

  return (
    <div
      key={clubIndex}
      className={`flex w-full ${clubTargetIndex === clubIndex && clubIndex != -1 ? "h-[" + (clubBarHeight + 50) + "px]" : "h-[" + clubBarHeight + "px]"} justify-between items-center cursor-pointer p-[10px] gap-[10px] border-t-1 border-zinc-800 ${clubIndex == clubs.length - 1 ? "border-b-1" : ""} hover:bg-zinc-200 dark:hover:bg-zinc-900`}
      onClick={() => {
        if (clubTargetIndex === clubIndex) {
          setClubTargetIndex(-1);
        } else {
          setClubTargetIndex(clubIndex);
        }
        setCanEdit(false);
      }}
    >
      <div className="flex gap-[10px] items-center ">
        {clubIndex != -1 ? (
          <>
            <button
              onClick={(e) => {
                if (!isInSelection()) {
                  addSelection(clubs[clubIndex].id);
                } else {
                  deleteSelection(clubs[clubIndex].id);
                }
                e.stopPropagation();
              }}
              className={`h-[25px] w-[25px] cursor-pointer ${isInSelection() ? "bg-zinc-400" : ""} rounded-md border-1 border-zinc-400`}
            ></button>

            <button
              onClick={(e) => {
                setClub(
                  clubIndex,
                  "isBookedMarked",
                  !clubs[clubIndex].isBookedMarked,
                );
                setCanViewBookMarks(true);
                e.stopPropagation();
              }}
              className={`h-[25px] w-[25px] cursor-pointer ${clubs[clubIndex]?.isBookedMarked ? "bg-yellow-400" : "bg-gray-500"} rounded-md`}
            ></button>

            <div>{clubs[clubIndex].name}</div>
            {clubs[clubIndex].tags.map((tagItem, _) => (
              <div
                key={_}
                className={`${tagItem.color} p-[10px] rounded-md h-[30px] flex items-center`}
              >
                <b>{tagItem.name}</b>
              </div>
            ))}
          </>
        ) : (
          <b>{text}</b>
        )}
      </div>
      <div className="flex gap-[5px]">
        {clubIndex != -1 &&
          clubs[clubIndex].managers.map((managerItem, _) => (
            <p key={_}>{managerItem.name}</p>
          ))}
      </div>
    </div>
  );
}
