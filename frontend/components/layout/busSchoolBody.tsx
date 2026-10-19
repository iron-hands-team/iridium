"use client"
import {useState} from "react";
import "@/app/globals.css";
import {bs} from "@/lib/busStore";

import Header from "@/components/layout/header";
import Btn from "@/components/ui/btn";
import AboutPopup from "@/components/layout/busesAboutPopup";

// school's account

export default function BusSchool() {
 const buses = bs((state) => state.buses);
 const updateFrame = bs((state) => state.updateFrame);

 const addBus = bs((state) => state.addBus);
 const deleteBus = bs((state)=> state.deleteBus);
 const setBus = bs((state)=> state.setBus);
 const insertBus = bs((state)=> state.insertBus);
 const clearBuses = bs((state)=> state.clearBuses);

 const addDestination = bs((state) => state.addDestination);
 const deleteDestination = bs((state)=> state.deleteDestination);
 const setDestination = bs((state) => state.setDestination);
 
 const [editPopup, setEditPopup] = useState(false);
 const [busIndexPopup, setBusIndexPopup] = useState(-1);


 const aboutPopup = bs((state) => state.aboutPopup);
 const setAboutPopup = bs((state) => state.setAboutPopup);
 
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

 
 function functionEditPopup(busIndex:number) {
  setEditPopup(true);
  setBusIndexPopup(busIndex);
 }

 function nothing() {

 }
 function setIsClickingFalse(notThisIndex:number) {/*
  for(let i = 0; i < buses.length; i++) {
    if(i !== notThisIndex) buses[i].isClicking = false;
  }*/
 }


  function SettingsUI<T>(variableName:string, value:T, headingName:string) {
   return (
    <div className="flex h-[70px]  items-center gap-[10px]">
     <p><b>{headingName}:</b></p>
 <input
     value={(buses[busIndexPopup][variableName])}
     onChange={(e) =>
         setBus(busIndexPopup, variableName, e.target.value)
     }
     placeholder={`Enter ${variableName} Here`}
     className="text-white w-1/3 h-12 p-2 border border-zinc-800 hover:border-white text-[18px] font-sans"
 />
     
    </div>
   )
  }

  function DestinationUI<T>(destinationIndex:number,variableName:string, value:T, headingName:string) {
    return (
      <div className="flex gap-[10px] h-[50px] items-center">
        <p>{headingName}</p>
        <input value={buses[busIndexPopup].destinations[destinationIndex][variableName]} onChange={(e)=>{ buses[busIndexPopup].destinations = setDestination(buses[busIndexPopup].destinations, destinationIndex, variableName, e.target.value);updateFrame();}} className="text-white h-[40px] w-[120px]"></input>
      </div>
    );
  }


 return (
  <div className="flex items-center flex-col bg-black h-[100vh]">

      {aboutPopup && <AboutPopup/>}

      {editPopup &&
        <div className="z-100 fixed flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto  flex-col flex-wrap" onClick={() => setEditPopup(false)}>
         <div className="bg-black/90  z-10 h-2/3 w-2/3  flex flex-col justify-between items-start border-1 border-zinc-400 overflow-y-auto p-[10px]"  onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col w-full items">
                     <div className="flex w-full h-[100px] items-center justify-between ">
           <p className="text-[30px]">Edit {buses[busIndexPopup].name}'s' Information</p>
           <Btn onclick={()=>setEditPopup(false)} text="Close"/>
          </div>
          {SettingsUI("name", buses[busIndexPopup].name, "Name")}
          {SettingsUI("desc", buses[busIndexPopup].desc, "Description")}
          
          <p>Bus Stops </p>
          <div className="w-1/3">          <Btn onclick={()=>{buses[busIndexPopup].destinations=addDestination(buses[busIndexPopup].destinations); updateFrame();}} text="Add Destination"/></div>
          <br></br>
          {buses[busIndexPopup].destinations.length > 0 && <div className="w-full flex flex-col items-center gap-[10px] bg-blue-700 p-[10px] rounded-xl border-1 border-zinc-600" >
            {buses[busIndexPopup].destinations.map((destinationItem, destinationIndex) => (
              <div key={destinationIndex} className="w-full flex items-center gap-[20px]">
                {DestinationUI(destinationIndex, "location", "dih", "Location")}
                {DestinationUI(destinationIndex, "beforeSchoolTime", "dih", "Before School Time")}
                {DestinationUI(destinationIndex, "afterSchoolTime", "dih", "After School Time")}
                <p>Color:</p>
                <div className="flex items-center justify-center gap-[10px]">
                  {Object.entries(buttonColors).map(([name, value], index) => (
                    <div key={index} className={"w-[30px] h-[30px] rounded-md cursor-pointer " + value} onClick={()=>{buses[busIndexPopup].destinations = setDestination(buses[busIndexPopup].destinations, destinationIndex, "color", value); updateFrame()}}></div>
                  ))}
                </div>
                <Btn onclick={()=>{buses[busIndexPopup].destinations=deleteDestination(buses[busIndexPopup].destinations, destinationIndex); updateFrame()}} text="Delete"/>
              </div>
            ))}
          </div>}

          <br></br>
          <div className="flex  w-full items-start gap-[10px] ">
           <p><b>Color:</b></p>
           <div className="h-[100px] w-1/3  border-zinc-600 flex flex-wrap gap-[10px]">
           {Object.entries(buttonColors).map(([name, value], index) => (
            <div key={index} className="w-1/4">
              <button className= {" w-full h-full py-2 border-1 cursor-pointer " + buttonColors[name]} onClick={() => {setBus(busIndexPopup, "color", value); console.log(value)}}><p>{name}</p></button>
            </div>
           ))}
           </div>
          </div>
          </div>
          <br></br>
          <Btn onclick={()=>{deleteBus(busIndexPopup);setEditPopup(false)}} text="Delete"/>
            <br></br>
          <Btn onclick={()=>setEditPopup(false)} text="Close"/>
           <br></br>
         </div>
        </div>
       }

      <div className="sticky top-0 z-50 bg-gray-800 h-[200px] w-full shadow-md">

      <Header headerText={
       <p className="text-[30px]"><b>School Account. For authorized people</b></p>
      }/>
      <div className="flex w-full gap-[10px] border-b-1 border-t-1 border-white items-center bg-gray-800 p-[10px] justify-start">
        <Btn onclick={()=>addBus()} text="Add Bus"/>
        <Btn onclick={()=>clearBuses()} text="Clear Buses"/>
        <Btn onclick={()=>{setAboutPopup(true); console.log("asdlkmasl dkm")}} text="About"/>
      </div>
      </div>
      <br></br>
      <div className=" w-full bg-black flex flex-col items-center justify-center">
          <div  className="w-full flex flex-col items-center justify-center">
            <div className="bg-gray-800 w-full h-[100px] border-1 border-zinc-600 flex justify-between">
              <div className="flex items-center justify-center w-1/4"><p><b>Spot Number</b></p></div>
              <div className="flex items-center justify-center w-1/4"><p><b>Bus Name</b></p></div>
              <div className="flex items-center justify-center w-1/4"><p><b>Route</b></p></div>
              <div className="flex items-center justify-center w-1/4"><p><b>Settings</b></p></div>
            </div>

          </div>
        {buses.map((busItem, busIndex) => (
          <div key={busIndex} onClick={()=>{setBus(busIndex, "isClicking", !busItem.isClicking); if(!busItem.isClicking){setIsClickingFalse(busIndex)}}}  className={"w-full flex flex-col items-center justify-center " } >
            <div className={`bg-gray-800 w-full border border-zinc-600 flex justify-between transition-all duration-300 ease-in-out overflow-hidden ${
    busItem.isClicking ? "max-h-[500px]" : "max-h-[50px]"
  }`} >
              <div className="flex items-center justify-center w-1/4 text-[20px] border-l-1 border-r-1 border-zinc-600">

                              <p><b>{busIndex}</b></p>
              </div>
              <div className="w-1/4 flex items-center justify-center ">
                <div className={"h-full w-3/4  flex justify-center items-center rounded-xl border-1 border-zinc-600 p-[10px] "+ buses[busIndex].color}>
                  <input className="text-black  w-full resize-none h-[50px] p-2   hover:border-zinc-600 text-[18px] font-sans font-bold text-center" placeholder="Bus Name" value={busItem.name} onChange={(e)=>setBus(busIndex, "name", e.target.value)}></input>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start w-1/4 p-[10px] overflow-y-auto gap-[10px] border-l-1 border-r-1 border-zinc-600 "  >
                {busItem.isClicking && <p className="text-[20px]"><b>{busItem.destinations.length} Stops</b></p>}
                {busItem.isClicking && busItem.destinations.map((destinationItem, destinationIndex) => (
                  <div key={destinationIndex} className="w-full  flex gap-[20px]">
                    <div className={"h-[20px] w-[20px] rounded-md " + destinationItem.color}></div>
                    <p className=""><b>Location:</b> {destinationItem.location === "" ? "None" : destinationItem.location} </p>

                    <p className=""><b>BST:</b> {destinationItem.beforeSchoolTime === "" ? "None" : destinationItem.beforeSchoolTime}</p>

                    <p >AST: {destinationItem.afterSchoolTime === "" ? "None" : destinationItem.afterSchoolTime}</p>

                  </div>
                ))}
                {busItem.isClicking && busItem.destinations.length === 0 && <p>No Routes Made.</p>}
                {!busItem.isClicking && <p>Click to View <b>({busItem.destinations.length} Stops)</b></p>}
              </div>
              <div className="flex items-center justify-center w-1/4 bg-gray-400 gap-[10px]">
                <Btn onclick={() => functionEditPopup(busIndex)} text="Edit"/>
                <Btn onclick={() => nothing()} text="Move"/>
              </div>
            </div>

          </div>
        ))}
   
      </div>
      <br></br>
      {buses.length == 0 && <p className="text-[30px] flex w-full justify-center">No buses created yet. Make one by using the button below!</p>}
      <div className="flex h-[100px] items-center gap-[10px]">
        <p>Add New Bus Here: </p>
        <Btn onclick={()=>addBus()} text="Add Bus"/>
      </div>


   
  </div>
 );
}

// /