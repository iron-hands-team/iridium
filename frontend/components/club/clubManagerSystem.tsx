"use client"

import {useState} from "react";
import "@/app/globals.css";

import {cls} from "@/lib/clubStore";

import Btn from "@/components/ui/btn";
import Header from "@/components/layout/header";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

import TagsSystemPopup from "@/components/club/clubTagsSystem";


export default function ClubManagerSystem() {
 const clubs = cls((s) => s.clubs);
 const tags = cls((s) => s.tags);
 const updateFrame = cls((s) => s.updateFrame);

 const setClub = cls((s) => s.setClub);
 const deleteClub = cls((s) => s.deleteClub);

 const setPerson = cls((s) => s.setPerson);
 const addPerson = cls((s) =>s.addPerson);
 const deletePerson = cls((s) =>s.deletePerson);

 const canEdit = cls((s) => s.canEdit);
 const setCanEdit = cls((s) => s.setCanEdit);

 const clubTargetIndex = cls((s) => s.clubTargetIndex);
 const setClubTargetIndex = cls((s) => s.setClubTargetIndex);

 function nothing() {

 }

 function editInputText(variableName:string, name:string, showType:boolean) {
  return (
   <div className="flex w-full items-center gap-[10px]">
    {canEdit && <p><b>{name}:</b></p>}
    {canEdit ? <Input placeholder={"Enter " + name} value={clubs[clubTargetIndex][variableName]} setValue={(e)=>{setClub(clubTargetIndex, variableName, e);}} styles="" /> : <p><b>{showType && name + ": "} {clubs[clubTargetIndex][variableName]}</b></p>}
   </div>
  )
 }

 return (
  <div className="flex flex-col w-1/3 h-full bg-gray-800 p-[10px] justify-start gap-[10px] relative border-l-1 border-t-1 border-zinc-400">
      <div className="absolute top- right-[10px] ">
        <Btn onclick={()=>setCanEdit(!canEdit)} text="Edit"/>
      </div>
      

      <div className="flex w-full items-end gap-[10px] ">
       {!canEdit && <button onClick={(e)=>{setClub(clubTargetIndex, "isBookedMarked", !clubs[clubTargetIndex].isBookedMarked); e.stopPropagation()}} className={`h-[25px] w-[25px] cursor-pointer ${clubs[clubTargetIndex].isBookedMarked ? "bg-yellow-500" : "bg-gray-500"} rounded-md`}></button>}
      {canEdit && <p><b>Name:</b></p>}
      {canEdit ? <Input placeholder={"Enter Name"} value={clubs[clubTargetIndex].name} setValue={(e)=>{setClub(clubTargetIndex, "name", e);}} /> : <p className="text-[30px]"><b>{clubs[clubTargetIndex].name}</b></p>}
      {!canEdit && clubs[clubTargetIndex].name != "" && <div className={`${clubs[clubTargetIndex].tag.color} p-[10px] self-start rounded-md h-[40px] flex items-center`}><p>{clubs[clubTargetIndex].tag.name}</p></div>}
     </div>
      {editInputText("id", "ID", true)}
      {editInputText("location", "Location", true)}
      
      {canEdit ?
      <div>
       <p><b>Description</b></p>
       <Textarea
       placeholder="Enter Description Here:"
       value={clubs[clubTargetIndex].desc}
       setValue={(e) => setClub(clubTargetIndex, "desc", e)}/>
      </div>
      :
      <div><p><b>Description:</b></p><p>{clubs[clubTargetIndex].desc}</p></div>}

      {canEdit && <div className="w-full ">
       <p>Choose Tag:</p>
       <div className="w-full flex flex-wrap gap-[10px]">
       {tags.map((tagItem, tagIndex) => (
        <button key={tagIndex} className={`${tagItem.color}  h-[40px] rounded-lg`} onClick={()=>setClub(clubTargetIndex, "tag", tagItem)}><p>{tagItem.name}</p></button>
       ))}
       {tags.length == 0 && <p>No Tags Created.</p>}
       </div>
      </div> }

      {canEdit ?
       <div className="flex flex-col w-full h-[50px] gap-[10px]  h-[200px] overflow-y-auto justify-start items-start ">
        <div className="flex items-center"><p><b>Managers:</b></p><Btn onclick={()=>{clubs[clubTargetIndex].managers = addPerson(clubs[clubTargetIndex].managers);updateFrame();}} text="Add Manager"/></div>

        {clubs[clubTargetIndex].managers.map((managerItem, managerIndex) => 
         <div key={managerIndex}className="flex gap-[10px]">
           <Input value={managerItem.name} setValue={(e)=>{ clubs[clubTargetIndex].managers = setPerson(clubs[clubTargetIndex].managers, managerIndex, "name", e);updateFrame();}} placeholder="Enter Manager Name"/>
           <Input value={managerItem.desc} setValue={(e)=>{clubs[clubTargetIndex].managers = setPerson(clubs[clubTargetIndex].managers, managerIndex, "desc", e);updateFrame();}} placeholder="Enter Description"/>
         </div>
        )}
       </div>
       :
       <div className="flex gap-[5px] flex-wrap items-center">
        <p>Managers:</p>
        {clubs[clubTargetIndex].managers.map((managerItem, _) =>
        <p key={_}>{managerItem.name}, </p>)}
        {clubs[clubTargetIndex].managers.length == 0 && <p><b>No Managers</b></p>}
       </div>
      }
      {canEdit ? 
      <div></div>:
      <div>
       <p><b>Members: {clubs[clubTargetIndex].students.length}</b></p>
      </div>
     }
     {!canEdit && <div>
      <Btn onclick={()=> {nothing()}} text="Send Message To Managers"/>
      </div>}
      
      {canEdit && <div>
       <Btn onclick={()=>{deleteClub(clubTargetIndex); setClubTargetIndex(-1)}} text="Delete Club"/>
      </div>}

     </div>
 )
}