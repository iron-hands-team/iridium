"use client"
import {useState} from "react";
import {cls} from "@/lib/clubStore";

import Btn from "@/components/ui/btn";
import Header from "@/components/layout/header";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";


export default function SelectionControlBar() {
 const selectionControlBar = cls((state) => state.selectionControlBar);
 const setSelectionControlBar = cls((state) => state.setSelectionControlBar);


 const clubs = cls((state)=> state.clubs);
 const selection = cls((state) => state.selection);

 const deleteEverythingSelection = cls((state)=> state.deleteEverythingSelection);

  const deleteClub = cls((state) => state.deleteClub);
  const setClub = cls((state)=> state.setClub);

 const cti = cls((state) => state.clubTargetIndex);

 const [position, setPosition] = useState({x:100, y:100});


 function numberIsClubID() {
 }
 function deleteEverything() {
  clubs.map((clubItem, clubIndex) => {
   if(selection.includes(clubItem.id)) {
    deleteClub(clubItem.id)
   }
  })
 }

 function unselectEverything() {
  selection.length = 0;
 }
 
 function nothing() {}

 return (
  <div
  style={{position: "fixed", left: position.x, top: position.y}}
  onMouseDown={(e)=> {
   const offsetX = e.clientX -position.x;
   const offsetY = e.clientY - position.y;

   const move = (e: MouseEvent) => {
    setPosition({
     x: e.clientX -offsetX,
     y: e.clientY - offsetY
    });
   }
   const stop = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", stop);
   }

   window.addEventListener("mousemove", move);
   window.addEventListener("mouseup", stop);
  }}
  className="fixed flex h-[200px] w-[500px] justify-start items-start bg-slate-600/95 overflow-y-auto flex-col flex-wrap z-100 rounded-lg border-1 border-zinc-400  shadow-[0_4px_10px_rgba(0,0,0,0.5)] cursor-grab p-[10px]" onClick={() => setSelectionControlBar(false)}>
   <div className="flex items-center gap-[10px] ">
    <p className="text-[30px]"><b>Super Selector </b></p>
    <p><b>({selection.length}) Selected</b></p>
   </div>
   <br></br>
   <div className="flex gap-[10px] flex-1 w-full justify-center">
    <Btn onclick={()=>deleteEverything()} text={"Delete " + selection.length}/>
    <Btn onclick={()=>{deleteEverythingSelection()}} text={"Unselect " + selection.length}/>
   </div>
  </div>
 );
}