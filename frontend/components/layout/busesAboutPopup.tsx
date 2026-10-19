"use client"
import {useState} from "react";
import {bs} from "@/lib/busStore";

export default function busesAboutPopup() {
 const aboutPopup = bs((state)=> state.aboutPopup);
 const setAboutPopup = bs((state) => state.setAboutPopup);

 return (


 <div className="z-100 fixed flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto flex-col flex-wrap" onClick={()=> setAboutPopup(false)}>
   <div className="bg-black/90 z-10 h-2/3 w-2/3 flex flex-col justify-between items-start border-1 border-zinc-400 overflow-y-auto p-[10px] text-[20px]" onClick={(e)=> e.stopPropagation()}>
     <div className="flex flex-col w-full h-full">
       <p><b>How to use the Bus Manager</b></p>
       <br></br>
       <p><b>The Nav Bar:</b> Contains the "Add Bus", "Clear Buses", and "About" buttons.</p>
       <br></br>
       <p><b>Creating Buses:</b> Go to the top-left or bottom-center and you will see the add Bus. Click on it and a new bus row should appear.</p>
       <br></br>
       <p><b>Inside each row:</b> The Spot number, Bus Name, It's Route, and additional notes.</p>
       <br></br>
       <p><b>To edit the bus information:</b> Go to the "Edit" button on the right of the row. The bus editor board should pop up. </p>
       <p>Inside the editor board: All of the functions will be gone over here</p>
       <p><b>Name:</b> A text-field for the bus's name</p>
       <p><b>Description:</b> For is for extra information about the buses</p>
       <p><b>Managing Bus Stops:</b> To create a new bus stop for the route, press on the "Add Destination" button. Each destination created contains the location, before school time and after school time. There is a delete destination button on the right.</p>
       <br></br>
       <p><b>BST:</b> Before School Time. Bus's arrival time before school starts.</p>
       <p><b>AST:</b> After School Time. Bus's arrival time after school ends.</p>
       <br></br>
       <p><b>Colors:</b> This is to color code the bus row. Helps find buses easier and can be used to sort them out.</p>
       <br></br>
       <p><b>Delete Bus Button: </b>Deletes the bus row.</p>
       <p></p>
     </div>
   </div>
 </div>

 );
}