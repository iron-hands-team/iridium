"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";
import {cs} from "@/lib/classStore";

export default function aboutPopup() {
 const aboutPopup = cs((state)=>state.aboutPopup);
 const setAboutPopup = cs((state)=>state.setAboutPopup);

 return (
  <div className="fixed inset-0 flex h-full w-full justify-center items-center bg-black/90 " onClick={()=>setAboutPopup(false)}>
   <div className="h-[750px] w-3/4 z-10 overflow-y-auto flex flex-col justify-start items-start border-1 border-zinc-400 bg-black text-[30px] p-[10px]" onClick={(e)=>e.stopPropagation()}>
    <p className="text-[45px]">Class Dashboard help:</p>
    <p><b>What is this?</b></p>
    <p>This is where you manage all of your classes. Students, assignments, and announcments are all here.</p>
    <br></br>
    <p>How do you create and manage a class?</p>
    <p>To start, press the "Add Class" button on the top-left. A new class should appear.</p>
    <br></br>
    <p>There are a few buttons and text-fields inside the class you created. They are easy to learn! Will be put into the bullet points below:</p>
    <p><b>Class Name Text-field:</b> Right now, it should be called "untitled". TO change that, click on it and enter you class's name. It automatically saves.</p>
    <p><b>Manage Announcements:</b> This will be the tool for you to communicate to the students in this class. The announcements board contains a place for you to make new messages(All students will be able to see), and the previous ones you made.</p>
    <p><b>Manage assignments:</b> Making new assignments has never been easier! To do so, click on the "Make New Assignment". Then, plug in the name, description, and the homework link into the thing you just made.</p>
    <p><b>Manage Quizzes:</b> You can create custom quizzes in the quiz board for this class. The quizzes hold multiple choice questions. After creating choice for a question and you want to set a few or one into an answer, click the "Set As Answer" button next to them. Each quiz automatically saves.</p>
    <p><b>How to manage students:</b> First, create a new student. Next, change it's name in the text-field to the left, then,</p>
    
   </div>
  </div>
 );
}