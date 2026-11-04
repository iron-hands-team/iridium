"use client"

import {useState} from "react";
import "@/app/globals.css";

import {cls} from "@/lib/clubStore";

import Btn from "@/components/ui/btn";
import Header from "@/components/layout/header";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

interface ClubBarInterface {
 clubIndex:number;
 text:string;

}

export default function ClubBar({clubIndex, text}:ClubBarInterface) {
 const clubs = cls((state) => state.clubs);
 const setClub = cls((state)=> state.setClub);
 const selection = cls((state) => state.selection);

 const setCanEdit = cls((s) => s.setCanEdit);

 const clubTargetIndex = cls((s) => s.clubTargetIndex);
 const setClubTargetIndex = cls((s) => s.setClubTargetIndex);

 const canViewBookMarks = cls((s) => s.canViewBookMarks);
 const setCanViewBookMarks = cls((s) => s.setCanViewBookMarks);

 const addSelection = cls((state)=> state.addSelection);
 const deleteSelection =cls((state) => state.deleteSelection);


 const clubBarHeight = cls((state)=> state.clubBarHeight);



 function isInSelection() {
  return selection.includes(clubIndex);
 }


 return (
    <div 
  key={clubIndex} 
  className={`flex w-full ${clubTargetIndex === clubIndex && clubIndex!=-1 ? "bg-gray-700 h-["+(clubBarHeight+50)+"px]" : "bg-gray-800 h-["+clubBarHeight+"px]"}justify-between items-center cursor-pointer p-[10px] gap-[10px] border-t-1 border-zinc-600 ${clubIndex == clubs.length - 1 ? "border-b-1" : ""}  hover:bg-gray-600`}
  onClick={()=>{if(clubTargetIndex === clubIndex){ setClubTargetIndex(-1)} else {setClubTargetIndex(clubIndex)} setCanEdit(false);} }
  >
    
    <div className="flex gap-[10px] items-center ">
      {clubIndex != -1 ? 
        <>

        <button
        onClick={(e)=>{
          if(!isInSelection()){console.log(isInSelection()); addSelection(clubIndex); console.log(isInSelection())}
          else {
            console.log(isInSelection());
            deleteSelection(clubIndex);
            console.log(isInSelection())
          };
          console.log(selection);
          e.stopPropagation()
          }}
          className={`h-[25px] w-[25px] cursor-pointer ${isInSelection() ? "bg-zinc-400" : ""} rounded-md border-1 border-zinc-400`}
        ></button>

        <button onClick={(e)=>{setClub(clubIndex, "isBookedMarked", !clubs[clubIndex].isBookedMarked); setCanViewBookMarks(true); e.stopPropagation();}} className={`h-[25px] w-[25px] cursor-pointer ${clubs[clubIndex].isBookedMarked ? "bg-yellow-400" : "bg-gray-500"} rounded-md`}></button>

        <p>{clubs[clubIndex].name}</p>
        {clubs[clubIndex].tags.map((tagItem, _) => (
          <div key={_} className={`${tagItem.color} p-[10px] rounded-md h-[30px] flex items-center`}><p><b>{tagItem.name}</b></p></div>
        ))}
        </>
      :
      <p><b>{text}</b></p>
      } 
    </div>
    <div className="flex gap-[5px]">
      {clubIndex !=-1 && clubs[clubIndex].managers.map((managerItem, _) => <p key={_}>{managerItem.name}</p>)}
    </div>
  </div>
 )
}