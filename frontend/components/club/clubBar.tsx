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

}

export default function ClubBar({clubIndex}:ClubBarInterface) {
 const clubs = cls((state) => state.clubs);
 const setClub = cls((state)=> state.setClub);

 const setCanEdit = cls((s) => s.setCanEdit);

 const clubTargetIndex = cls((s) => s.clubTargetIndex);
 const setClubTargetIndex = cls((s) => s.setClubTargetIndex);
 
 return (
           <div 
         key={clubIndex} 
         className={`flex w-full h-[50px] justify-between items-center cursor-pointer p-[10px] gap-[10px] border-t-1 border-zinc-600 ${clubIndex == clubs.length - 1 ? "border-b-1" : ""} bg-gray-800 `}
         onClick={()=>{if(clubTargetIndex == -1) { setClubTargetIndex(clubIndex)} else {setClubTargetIndex(-1); setCanEdit(false)}}}
         >
          <div className="flex gap-[10px] items-center ">
           <button onClick={(e)=>{setClub(clubIndex, "isBookedMarked", !clubs[clubIndex].isBookedMarked); e.stopPropagation()}} className={`h-[25px] w-[25px] cursor-pointer ${clubs[clubIndex].isBookedMarked ? "bg-yellow-500" : "bg-gray-500"} rounded-md`}></button>
           <p>{clubs[clubIndex].name}</p>
           <div className={`${clubs[clubIndex].tag.color} p-[10px] rounded-md h-[40px]`}><p><b>{clubs[clubIndex].tag.name}</b></p></div>
          </div>
          <div className="flex gap-[5px]">
           {clubs[clubIndex].managers.map((managerItem, _) => <p key={_}>{managerItem.name}</p>)}
          </div>
         </div>
 )
}