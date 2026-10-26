"use client"

import {useState} from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";
import {cls} from "@/lib/clubStore";

export default function aboutClub() {
 const aboutPopup = cls((s) => s.aboutPopup);
 const setAboutPopup = cls((s)=> s.setAboutPopup);

 return (
   <div className="fixed inset-0 flex h-full w-full justify-center items-center bg-black/90" onClick={()=>setAboutPopup(false)}>
    <div className="h-[750px] w-3/4 z-10 overflow-y-auto flex flex-col justify-start items-start border-1 border-zinc-400 bg-black text-[30px] p-[10px] " onClick={(e)=>e.stopPropagation()}>
     <p className="text-[45px]">Club Dasboard help:</p>
     <p>Note: This is for the school system, not for teacher nor students</p>
     <br></br>
     <p>Making a Club: Click on the button in the control bar on the top</p>
     <p>To View Information inside a club: Click on the club bar.</p>
     <p>To Edit Information, click on the edit on the right in the information banner. Note: Both Club Managers and School System can change club's information</p>
     <br></br>
     <p>Informations that ccan be stored and altered in the bar:</p>
     <p>Name: Make a name what people can easily search for.</p>
     <p>ID: I don't really know. Schools can choose what it's purpose is.</p>
     <p>Description: What your club is about.</p>
     <p>Managers: There can be multiple managers. Just click on the "Add manager". Delete a maanger by clicking on the manager you want to delete.</p>
     <p>Members: Students. Students cannot alter club information, unless they get promoted to manager. Students information cannot be viewed in the app.</p>
     <br></br>
     <p>Bookmarking a club: The left side of the club bar, click on the square. Click again to unbookmark.</p>

     <p>Deleting a club: To Edit Mode, you will see a button at the bottom. Only use this if you are certain!</p>
     <br></br>
     <p>Tags: Tags help you organize and sort out your clubs by genre or whatever you want.</p>
    </div>
   </div>
 ); 
}