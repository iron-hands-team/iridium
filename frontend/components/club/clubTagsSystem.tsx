"use client"

import {useState} from "react";
import "@/app/globals.css";
import {cls} from "@/lib/clubStore";

import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";

export default function TagsSystemPopup() {
 const clubs = cls((state) => state.clubs);
 const tags = cls((state) => state.tags);

 const addTag = cls((state)=> state.addTag);
 const deleteTag = cls((state) => state.deleteTag);
 const setTag = cls((state)=>state.setTag);

 const canEditTags = cls((state) => state.canEditTags);
 const setCanEditTags = cls((state) => state.setCanEditTags);

 const clubTargetIndex = cls((state) => state.clubTargetIndex);
 const setClubTargetIndex = cls((state) => state.setClubTargetIndex);

  
 const borderColors: Record<string, string> = {
			blue: "border-blue-500",
			red: "border-red-500",
			green: "border-green-500",
			yellow: "border-yellow-500",
			purple: "border-purple-500",
			gray: "border-zinc-500",
	};

	const buttonColors: Record<string, string> = {
		blue: "bg-blue-400",
		red: "bg-red-400",
		green: "bg-green-400",
		yellow: "bg-yellow-400",
		purple: "bg-purple-400",
		gray: "bg-zinc-400",
	};

 const buttonHighlightedColors: Record<string, string> = {
  blue: "bg-blue-200",
  red: "bg-red-200",
  green: "bg-green-200",
  yellow: "bg-yellow-200",
  purple: "bg-purple-200",
  gray: "bg-gray-200"
 }

 return (
  <div className="z-100 fixed flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto flex-col flex-wrap" onClick={()=> setCanEditTags(false)}>
   <div className="bg-black/90 z-10 h-2/3 w-2/3 flex flex-col justify-between items-start border-1 border-zinc-400 overflow-yo-auto p-[10px]" onClick={(e)=> e.stopPropagation()}>
    <div className="flex flex-col w-full items">
     <p className="text-[30px]"><b>Tags</b></p>
     <br></br>
     <div className="w-[300px]">
     <Btn onclick={()=>addTag()} text="Add Tag"/></div>
      <br></br>
     <div className="flex flex-col w-full gap-[10px]">
      {tags.map((tagItem, tagIndex) => (
       <div key={tagIndex} className="flex w-full justify-start  gap-[10px]">

        <div className="items-center flex gap-[10px]">
         <p>Name: </p>
         <Input value={tagItem.name} setValue={(e)=>setTag(tagIndex, "name", e)} placeholder={`Enter Tag Name`}/>
        </div>

        <div className=" flex items-center gap-[10px]">
         <p>Color: </p>
         <div className="flex gap-[10px]">
          {!tagItem.isHidden && Object.entries(buttonColors).map(([name, value], index) => (
           <div key={index} className=" w-[25px] h-[25px] flex items-center">
            <button 
            className={`w-full h-full py-2 border-1 cursor-pointer ${tagItem.color == value ? value.slice(0, -3) + "200" : value} items-center rounded-md`}
            onClick={()=>setTag(tagIndex, "color", value)}
            ></button>
           </div>
          ))}
          
         </div>
        </div>
        <Btn onclick={()=>deleteTag(tagIndex)} text="Delete Tag"/>

       </div>
      ))}

     </div>
    </div>
   </div>
  </div>

 );
}