"use client"

import {useState} from "react";
import {cs} from "@/lib/classStore";
import Btn from "@/components/ui/btn";

export default function SettingsPopupClassTeacher() {

	const setSettingsPopup = cs((state)=>state.setSettingsPopup);
	const settingsClassIndex = cs((state)=> state.settingsClassIndex);

	const deleteClass = cs((state)=>state.deleteClass);
	const changeClassBorderColor = cs((state) => state.changeClassBorderColor);

 const borderColors: Record<string, string> = {
			blue: "border-blue-500",
			red: "border-red-500",
			green: "border-green-500",
			yellow: "border-yellow-500",
			purple: "border-purple-500",
			gray: "border-zinc-500",
   
	};
	const buttonColors: Record<string, string> = {
		blue: "bg-blue-600",
		red: "bg-red-800",
		green: "bg-green-800",
		yellow: "bg-yellow-600",
		purple: "bg-purple-800",
		gray: "bg-zinc-800",
	};

 return (
  				<div className="fixed flex h-full w-full justify-center items-center bg-black/90" onClick={() => setSettingsPopup(false)}>
					<div className="bg-black  z-10 h-2/3 w-2/3  flex justify-center items-center border-1 border-zinc-400"  onClick={(e) => e.stopPropagation()}>
						<div className=" h-[500px] w-[500px] bg-blue">
							<p className="text-[30px]">Settings</p>
							<br></br>
							<p className="text-[20px]">Color</p>
							<div className="flex w-full bg-gray-900 flex-wrap justify-center items-start p-5 border-1 border-zinc-800 gap-5">
							{Object.entries(borderColors).map(([name, value]) => (
								
										<div key={name} className="w-1/4">
											<button className= {" w-full h-full py-2 border-1 cursor-pointer " + buttonColors[name]} onClick={() => changeClassBorderColor(settingsClassIndex, value)}><p>{name}</p></button>
										</div>
								))}
							</div>
							<br></br>

							<div></div>

							<p className="text-[20px]">Delete Class</p>
							
							<Btn text="Delete Class" onclick={() => {deleteClass(settingsClassIndex);setSettingsPopup(false)}}/>
				
							<br></br>
							<br></br>

							<Btn text="Close"onclick={() => setSettingsPopup(false)}></Btn>
						</div>
					</div>
				</div>
 );
}