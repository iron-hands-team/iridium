"use client"

import {useState} from "react";
import "@/app/globals.css";

import {cls} from "@/lib/clubStore";

import Btn from "@/components/ui/btn";
import Header from "@/components/layout/header";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

import TagsSystemPopup from "@/components/club/clubTagsSystem";
import ClubManagerSystem from "@/components/club/clubManagerSystem";
import ClubsSystem from "@/components/club/clubTagsSystem";
import ClubBar from "@/components/club/clubBar";
import AboutClub from "@/components/club/aboutClub";


export default function clubTeacherBody() {
 const clubs = cls((s) => s.clubs);

 const canEditTags = cls((s) => s.canEditTags);
 const setCanEditTags = cls((s) => s.setCanEditTags);


 const addClub = cls((s) => s.addClub);
 
 const clubTargetIndex = cls((s)=> s.clubTargetIndex);

 const [searchClubInput, setSearchClubInput] = useState("");


 const canViewAll = cls((state)=> state.canViewAll);
 const setCanViewAll = cls((state)=>state.setCanViewAll);

 const canViewBookMarks = cls((state)=> state.canViewBookMarks);
 const setCanViewBookMarks = cls((state)=>state.setCanViewBookMarks);

 const canEdit = cls((state)=>state.canEdit);
 const setCanEdit = cls((state) => state.setCanEdit);

 const aboutPopup = cls((s)=>s.aboutPopup);
 const setAboutPopup = cls((s) => s.setAboutPopup);

 

 let currentClub = clubs[clubTargetIndex];

 function bookedMarkedLength() {
  let counter = 0;
  for(let i = 0; i < clubs.length; i++) {
    if(clubs[i].isBookedMarked) counter++;
  }
  return counter;
 }

 function nothing() {

 }

 return (
  <div className="flex items-start justify-start flex-col bg-black h-[100vh]">
   {canEditTags && <TagsSystemPopup/>}
   {aboutPopup && <AboutClub/>}


   <div className="flex w-full h-full flex-row-reverse">
    <div className="flex w-11/12 h-full">

     <div className={`flex flex-col h-full  ${clubTargetIndex == -1 ? "w-full" : "w-2/3"}`}>

      <div className="flex flex-col w-full h-full overflow-y-auto border-l-1 border-zinc-400 ">
          <div className="flex w-full gap-[10px] border-b-1 border-t-1 border-zinc-400 items-center bg-gray-900 p-[10px] justify-start">
     <Input value={searchClubInput} setValue={(e)=>setSearchClubInput(e)} placeholder="Enter Club Name or ID..."/>
     <Btn onclick={()=>{addClub(); setSearchClubInput(""); setCanViewAll(true);}} text="Add Club"/>
     <Btn onclick={()=>{setCanEditTags(true);}} text="Manage Tags"/>
      <Btn onclick={()=>{}} text="Bookmark"/>
    </div>

       <div className={`flex w-full h-[50px] justify-between items-center cursor-pointer p-[10px] gap-[10px] border-t-1 border-zinc-400 ${bookedMarkedLength() == 0 ? "border-b-1" : ""} bg-yellow-700`}
       onClick={()=>setCanViewBookMarks(!canViewBookMarks)}>
        <p>BookMarked ({bookedMarkedLength()}) {canViewBookMarks ? "⬇️" : "⬆️"}</p>
       </div>
       {canViewBookMarks && clubs.map((clubItem, clubIndex) => (
        clubItem.isBookedMarked && 
         <ClubBar key={clubIndex} clubIndex ={clubIndex}/>
       ))}


       <div className={`flex w-full h-[50px] justify-between items-center cursor-pointer p-[10px] gap-[10px] border-t-1 border-zinc-400 ${bookedMarkedLength() == 0 ? "border-b-1" : ""} bg-blue-600`}
       onClick={()=>setCanViewAll(!canViewAll)}>
        <p>All ({clubs.length}) {canViewAll ? "⬇️" : "⬆️"}</p></div>

       {canViewAll && clubs.map((clubItem, clubIndex) => (clubItem.name.toLowerCase().includes(searchClubInput.toLowerCase()) || clubItem.id.toString().includes(searchClubInput.toLowerCase())) && !clubItem.isBookedMarked && (
         <ClubBar key={clubIndex} clubIndex ={clubIndex}/>
       ))
       }
      </div>
     </div>
     
     {clubTargetIndex != -1 && <ClubManagerSystem/> }
    </div>
    <div className="w-1/12 h-full">
       <div className="p-[10px] flex flex-col gap-[10px]">
         <button onClick={()=>}><p className="text-[20px]"><b>Menu</b></p></button>
         <Btn onclick={()=>nothing()} text="Settings"/>
         <Btn onclick={() => setAboutPopup(true) } text="About"/>
       </div>
    </div>
   </div>
  </div>
 );
}