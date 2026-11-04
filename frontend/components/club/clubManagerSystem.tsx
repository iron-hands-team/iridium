"use client"

import {useState} from "react";
import "@/app/globals.css";

import {cls} from "@/lib/clubStore";

import Btn from "@/components/ui/btn";
import Header from "@/components/layout/header";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

import TagsSystemPopup from "@/components/club/clubTagsSystem";
import ClubsSystem from "./clubsSystem";

type Tag = {
 name: string;
 color: string;
 isHidden: boolean;
}

export default function ClubManagerSystem() {
 const clubs = cls((s) => s.clubs);
 const tags = cls((s) => s.tags);
 const uf = cls((s) => s.updateFrame);

 const setClub = cls((s) => s.setClub);
 const deleteClub = cls((s) => s.deleteClub);

 const setPerson = cls((s) => s.setPerson);
 const addPerson = cls((s) =>s.addPerson);
 const deletePerson = cls((s) =>s.deletePerson);

 const canEdit = cls((s) => s.canEdit);
 const setCanEdit = cls((s) => s.setCanEdit);

 const cti = cls((s) => s.clubTargetIndex);
 const setcti = cls((s) => s.setClubTargetIndex);

 const addTag = cls((s) => s.addTag);
 const deleteTag = cls((s) => s.deleteTag);

 const addTime = cls((s) => s.addTime);
 const deleteTime = cls((s) => s.deleteTime);
 const setTime = cls((s) => s.setTime);

 function nothing() {

 }

 function editInputText(variableName:string, name:string, showType:boolean) {
  return (
   <div className="flex w-full items-center gap-[10px]">
    {canEdit && <p><b>{name}:</b></p>}
    {canEdit ? <Input placeholder={"Enter " + name} value={clubs[cti][variableName]} setValue={(e)=>{setClub(cti, variableName, e);}} styles="" /> : <p><b>{showType && name + ": "} {clubs[cti][variableName]}</b></p>}
   </div>
  )
 }

 function clubHasTag(clubTagIndex:number) {
  tags.forEach((tagItem, tagIndex) => {
    if(tagItem.name == clubs[cti].name) return true;
  });
  return false;
 }

function tagHasClub(tagIndex: number): [boolean, number] {
    const index = clubs[cti].tags.findIndex(
        (clubTagItem) => clubTagItem.name === tags[tagIndex].name
    );

    return [index !== -1, index];
}

 return (
  <div className="flex flex-col w-1/3 h-full bg-gray-800 p-[10px] justify-start gap-[10px] relative border-1 rounded-lg border-zinc-400 overflow-y-auto">
      <div className="absolute top- right-[10px] ">
        <Btn onclick={()=>setCanEdit(!canEdit)} text="Edit"/>
      </div>
      

      <div className="flex w-full items-end gap-[10px] ">
       {!canEdit && <button onClick={(e)=>{setClub(cti, "isBookedMarked", !clubs[cti].isBookedMarked); e.stopPropagation()}} className={`h-[25px] w-[25px] cursor-pointer ${clubs[cti].isBookedMarked ? "bg-yellow-500" : "bg-gray-500"} rounded-md`}></button>}
      {canEdit && <p><b>Name:</b></p>}
      {canEdit ? <Input placeholder={"Enter Name"} value={clubs[cti].name} setValue={(e)=>{setClub(cti, "name", e);}} /> : <p className="text-[30px]"><b>{clubs[cti].name}</b></p>}
      {!canEdit && clubs[cti].name != "" && 
      clubs[cti].tags.map((tagItem, tagIndex) => (
        <div key={tagIndex}className={`${tagItem.color} p-[10px] self-start rounded-md h-[40px] flex items-center`}><p>{tagItem.name}</p></div>
      ))}
     </div>
      {editInputText("id", "ID", true)}
      {editInputText("location", "Location", true)}
      
      {canEdit ?
      <div>
       <p><b>Description</b></p>
       <Textarea
       placeholder="Enter Description Here:"
       value={clubs[cti].desc}
       setValue={(e) => setClub(cti, "desc", e)}/>
      </div>
      :
      <div><p><b>Description:</b></p><p>{clubs[cti].desc}</p></div>}

      {canEdit && <div className="w-full ">
       <p>Choose Tag:</p>
       <div className="w-full flex flex-wrap gap-[10px]">
        {tags.map((tagItem, tagIndex) => (
          // looping through 
          <button key={tagIndex} className={`${tagItem.color} p-[10px] rounded-md h-[30px] flex items-center `} onClick={()=>{
            if(!tagHasClub(tagIndex)[0]) 
            { clubs[cti].tags = addTag(clubs[cti].tags,
              {
                name:tags[tagIndex].name,
                color: tags[tagIndex].color,
                isHidden: tags[tagIndex].isHidden
              }); 
              uf(clubs, tags)
            } 
            else {
              clubs[cti].tags = deleteTag(clubs[cti].tags, tagHasClub(tagIndex)[1]);
              uf(clubs, tags)
            }
          }
        }
        /*onClick={()=> setClub(cti, "tag", tagItem)}*/><p>{tagItem.name}</p></button>
       ))}

       {tags.length == 0 && <p>No Tags Created.</p>}
       </div>
      </div> }

      {canEdit ?
       <div className="flex flex-col w-full gap-[10px]  h-[200px] overflow-y-auto justify-start items-start ">
        <div className="flex items-center"><p><b>Managers:</b></p><Btn onclick={()=>{clubs[cti].managers = addPerson(clubs[cti].managers);uf(clubs, tags);}} text="Add Manager"/></div>

        {clubs[cti].managers.map((managerItem, managerIndex) => 
         <div key={managerIndex}className="flex gap-[10px]">
           <Input value={managerItem.name} setValue={(e)=>{ clubs[cti].managers = setPerson(clubs[cti].managers, managerIndex, "name", e);uf(clubs, tags);}} placeholder="Enter Manager Name"/>
           <Input value={managerItem.desc} setValue={(e)=>{clubs[cti].managers = setPerson(clubs[cti].managers, managerIndex, "desc", e);uf(clubs, tags);}} placeholder="Enter Description"/>
         </div>
        )}
       </div>
       :
       <div className="flex gap-[5px] flex-wrap items-center">
        <p>Managers:</p>
        {clubs[cti].managers.map((managerItem, _) =>
        <p key={_}>{managerItem.name}, </p>)}
        {clubs[cti].managers.length == 0 && <p><b>No Managers</b></p>}
       </div>
      }
      {canEdit ? 
      <div>
        <p>The</p>
      </div>:
      <div>
       <p><b>Members: {clubs[cti].students.length}</b></p>
      </div>
      }
      { canEdit ?
        <div>
          
          <div className="flex items-center">
            <p><b>Schedule</b></p>
            <Btn onclick={()=>{clubs[cti].schedule = addTime(clubs[cti].schedule); uf(clubs, tags)}} text="Add Time"/>
          </div>

          
          {clubs[cti].schedule.length > 0 && 
            <div className="w-full h-[50px] items-center  grid grid-cols-4 gap-[10px] ">
              <p className="text-center">Day</p>
              <p className="text-center">Starting Time</p>
              <p className="text-center">Ending Time</p>
              <p  className="text-center">Delete...</p>
            </div>
          }

          {clubs[cti].schedule.map((scheduleItem, scheduleIndex) => (
            <div key={scheduleIndex} className="w-full flex gap-[10px]  grid-cols-4 ">
              <div className="w-1/4">
                              <Input 
              value={scheduleItem.day}
              setValue={(e)=> {clubs[cti].schedule = setTime(clubs[cti].schedule, scheduleIndex, "day", e);uf(clubs, tags)}}
              placeholder="Enter Day Here: "
              />
              </div>
              <div className="w-1/4">
                            <Input 
              value={scheduleItem.startingTime}
              setValue={(e)=> {clubs[cti].schedule = setTime(clubs[cti].schedule, scheduleIndex, "startingTime", e); uf(clubs, tags)}}
              placeholder="Enter Starting-Time Here: "
              />
              </div>
              <div className="w-1/4">
                              <Input 
              value={scheduleItem.endingTime}
              setValue={(e)=> {clubs[cti].schedule = setTime(clubs[cti].schedule, scheduleIndex, "endingTime", e);uf(clubs, tags)}}
              placeholder="Enter Ending-Time Here:"
              />
              </div>
              <div className="w-1/4 ">
              <Btn onclick={()=>{clubs[cti].schedule = deleteTime(clubs[cti].schedule, scheduleIndex); uf(clubs, tags)}} text="Delete Time"/>
              </div>
            </div>
          ))}
        </div> 
        :
        <div className="flex flex-col ">
          <p className="mb-[10px]"><b>Schedule:</b></p>
          {clubs[cti].schedule.map((scheduleItem, scheduleIndex)=> (
            
            <div key={scheduleIndex} className="grid grid-cols-3 w-full  h-[40px] items-center border-1 border-zinc-600 ">
              <p className="text-center border-r-1 border-zinc-600">{scheduleItem.day == "" ? "untitled" : scheduleItem.day}</p>
              <p className="text-center">{scheduleItem.startingTime == "" ? "untitled" : scheduleItem.startingTime}</p>
              <p className="text-center border-l-1 border-zinc-600">{scheduleItem.endingTime == "" ? "untitled" : scheduleItem.endingTime}</p>
              
            </div>
          ))}
        </div>
      }

      
     {!canEdit && <div>
      <Btn onclick={()=> {nothing()}} text="Send Message To Managers"/>
      </div>}
      
      {canEdit && <div>
       <Btn onclick={()=>{deleteClub(cti); setcti(-1)}} text="Delete Club"/>
      </div>}

     </div>
 )
}


              // {[scheduleItem.day, scheduleItem.startingTime, scheduleItem.endingTime].map((item, index) => (
              //   <p key={index} className="text-center">
              //     {item || "untitled"}
              //   </p>
              // ))}