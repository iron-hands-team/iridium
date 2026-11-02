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
import SelectionControlBar from "@/components/club/selectionControlBar";
import Settings from "@/components/club/clubSettings";


export default function clubTeacherBody() {
 const clubs = cls((s) => s.clubs);

 const selection = cls((state) => state.selection);

 const addSelection = cls((state)=> state.addSelection);
 const deleteSelection = cls((state)=>state.deleteSelection);

 const selectionControlBar = cls((state) => state.selectionControlBar);
 const setSelectionControlBar = cls((state) => state.setSelectionControlBar);
 
 const deleteEverythingSelection = cls((state) => state.deleteEverythingSelection);
  const deleteEverythingClub = cls((state) => state.deleteEverythingClub);
  const deleteEverythingTag = cls((state) => state.deleteEverythingTag);

 const settings = cls((state) => state.settings);
 const setSettings = cls((state)=> state.setSettings);

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
 
 const [toggleLeftBar, setToggleLeftBar] = useState(true);
 let currentClub = clubs[clubTargetIndex];

 const appColors: Record<string, string> = {
  blue: "bg-blue-400",
  red: "bg-red-400",
  green: "bg-green-400",
  yellow: "bg-yellow-500",
  purple: "bg-pruple-400",
  gray: "bg-zinc-400"
};

 function bookedMarkedLength() {
  let counter = 0;
  for(let i = 0; i < clubs.length; i++) {
    if(clubs[i].isBookedMarked) counter++;
  }
  return counter;
 }

 function isOneSelected() {
  return selection.length > 0;
 }

 function totalMember() {
  let total = 0;
  clubs.map((clubItem, clubIndex) => {
    total += clubItem.students.length + clubItem.managers.length;
  })
  return total;
 } 

 function nothing() {

 }

 return (
  <div className="flex items-start justify-start flex-col bg-black h-[100vh]">
   <Header headerText={<p className="text-[30px]">Club Management</p>}/>
   <div className="flex w-full h-full flex-row-reverse justify-start items-start border-t-1 border-white">
    <div className="flex w-11/12 h-full p-[20px] gap-[10px] justify-start">

     <div className={`flex flex-col h-full  ${clubTargetIndex == -1 ? "w-full" : "w-2/3"} justify-start`}>

      <div className="flex flex-col flex-1 overflow-y-auto border-r-1 border-l-1 border-b-1 border-zinc-400 rounded-lg flex-1 justify-start">

        <div className="flex w-full gap-[10px] border-b-1 border-t-1 border-zinc-400 items-center bg-gray-900 p-[10px] justify-start">
          <div className="w-2/3">
          <Input value={searchClubInput} setValue={(e)=>setSearchClubInput(e)} placeholder="Enter Club Name or ID..."/></div>
        </div>
        <div className="flex w-full  border-b-1 border-t-1 border-zinc-400 items-center bg-gray-900 p-[10px] justify-start gap-[100px]">

          <div className="flex gap-[10px]">
            <Btn onclick={()=>{addClub(); setSearchClubInput(""); setCanViewAll(true);}} text="Add Club"/>
            <Btn onclick={()=>{setCanEditTags(true);}} text="Manage Tags"/>
            <Btn onclick={()=>{}} text="Sort By"/>
          </div>

          <div className="flex gap-[10px]">
            <Btn onclick={()=>nothing()} text="Refresh"/>
            <Btn onclick={()=>{
              if(isOneSelected()) {
                deleteEverythingSelection();
              }
              else {
                clubs.map((clubItem, clubIndex) => {
                  addSelection(clubItem.id);
                });
              }
            }} text={isOneSelected() ? "Deselect" : "Select All"}/>
          </div>
        </div>
    
      <ClubBar clubIndex={-1} text="Bookmarked"/>
       {canViewBookMarks && clubs.map((clubItem, clubIndex) => (
        clubItem.isBookedMarked && 
         <ClubBar key={clubIndex} clubIndex ={clubItem.id} text=""/>
       ))}


       <div className={`flex w-full h-[50px] justify-between items-center cursor-pointer p-[10px] gap-[10px] border-t-1 border-zinc-400 ${bookedMarkedLength() == 0 ? "border-b-1" : ""} bg-gray-800`}
       onClick={()=>setCanViewAll(!canViewAll)}>
        <p><b>All ({clubs.length}) {/*canViewAll ? "⬇️" : "⬆️"*/}</b></p>
        </div>
       

       {canViewAll && clubs.map((clubItem, clubIndex) => (clubItem.name.toLowerCase().includes(searchClubInput.toLowerCase()) || clubItem.id.toString().includes(searchClubInput.toLowerCase())) && !clubItem.isBookedMarked && (
         <ClubBar key={clubIndex} clubIndex ={clubItem.id} text=""/>
       ))
       }

       <div className="flex flex-col w-full flex-1 items-center justify-start p-[20px]">
        <div className="border-1 border-zinc-600 p-[10px] w-1/3 justify-center items-center flex flex-col">
          <p><b>Statistics:</b></p>
          <div className="flex"><p>Clubs: {clubs.length}</p></div>
          <div className="flex"><p>Total Members: {totalMember()}</p></div>
        </div>
        <div className="flex items-center gap-[10px]">
          <p><b>Create a new Club here:</b></p><Btn onclick={()=>{addClub();setSearchClubInput(""); setCanViewAll(true);}} text="Add Club"/>
        </div>
        <br></br>
                <div className="flex items-center gap-[10px]">
          <p><b>How to use this (Very Useful)</b></p><Btn onclick={()=>{setAboutPopup(true)}} text="About"/>
        </div>
       </div>

      </div>
     </div>

     {clubTargetIndex != -1 && <ClubManagerSystem/> }
    </div>
    {toggleLeftBar ? <div className="w-1/12 h-full rounded-md border-1 border-zinc-600">
       <div className="p-[10px] flex flex-col gap-[10px]">
         <Btn onclick={()=>setToggleLeftBar(!toggleLeftBar)} text="Toggle bar"/>
         <Btn onclick={()=>setSettings(true)} text="Settings"/>
         <Btn onclick={() => setAboutPopup(true) } text="About"/>
       </div>
    </div> :
    <div className="h-full rounded-md border-1 border-zinc-600 bg-blue-500">
      <Btn onclick={()=> setToggleLeftBar(!toggleLeftBar)} text="8==>"/>
    </div>}
   </div>

      {canEditTags && <TagsSystemPopup/>}
   {aboutPopup && <AboutClub/>}
   {settings && <Settings/>}
   {/*selection.length > 0*/ false && <SelectionControlBar/>}
  </div>
 );
}