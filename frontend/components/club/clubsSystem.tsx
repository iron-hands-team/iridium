"use client"

import {useState} from "react";
import "@/app/globals.css";

import {cls} from "@/lib/clubStore";

import Btn from "@/components/ui/btn";
import Header from "@/components/layout/header";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

import TagsSystemPopup from "@/components/club/clubTagsSystem";

export default function ClubsSystem() {
 const clubs = cls((s) => s.clubs);
 const tag= cls((s) => s.tags);
 const updateFrame =cls((s) => s.updateFrame);

 const setClub = cls((s) => s.setClub);
 const deleteClub = cls((s) => s.deleteClub);

 const setPerson  =cls((s) => s.setPerson);
 const addPerson  =cls((s) => s.addPerson);
 const deleteperson = cls((s)=> s.deletePerson);

 const ccanEdit =cls((s) => s.canEdit);
 const setCanEdit = cls((s) => s.setCanEdit);

 const clubTargetIndex = cls((s) => s.clubTargetIndex);
 const setClubTargetIndex = cls((s) => s.setClubTargetIndex);
 
 const addClub = cls((s) => s.addClub);

 const [searchClubInput, setSearchClubInput] = useState("");

 const setCanEditTags = cls((s)=> s.setCanEditTags);

 return (
       <div className={`flex flex-col h-full  ${clubTargetIndex == -1 ? "w-full" : "w-2/3"}`}>
  
        <div className="flex flex-col w-full h-full overflow-y-auto border-l-1 border-white bg-blue-500">
            <div className="flex w-full gap-[10px] border-b-1 border-t-1 border-white items-center bg-gray-800 p-[10px] justify-start">
      <Input value={searchClubInput} setValue={(e)=>setSearchClubInput(e)} placeholder="Search for a Club..."/>
      <Btn onclick={()=>{addClub(); setSearchClubInput("")}} text="Add Club"/>
      <Btn onclick={()=>{setCanEditTags(true);}} text="Manage Tags"/>
     </div>
         {clubs.map((clubItem, clubIndex) => clubItem.name.toLowerCase().includes(searchClubInput.toLowerCase()) && (
           <div 
           key={clubIndex} 
           className={`flex w-full h-[50px] justify-between items-center cursor-pointer p-[10px] gap-[10px] ${clubIndex % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}`}
           onClick={()=>{if(clubTargetIndex == -1) { setClubTargetIndex(clubIndex)} else {setClubTargetIndex(-1); setCanEdit(false)}}}
           >
            a
            <div className="flex gap-[10px] items-center ">
             <p>{clubItem.name}</p>
             <div className={`${clubItem.tag.color} p-[10px] rounded-md h-[40px]`}><p><b>{clubItem.tag.name}</b></p></div>
            </div>
            <div className="flex gap-[5px]">
             {clubItem.managers.map((managerItem, _) => <p key={_}>{managerItem.name}</p>)}
            </div>
            
            
           </div>
         ))
         }
        </div>
       </div>
 )
}