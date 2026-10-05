"use client"

import {useState} from "react";
import {cs} from "@/lib/classStore";
import Btn from "@/components/ui/btn";

export default function SettingsPopupClassTeacher() {

	const settingsClassIndex = cs((state)=> state.settingsClassIndex);
	const setStudentsPopup = cs((state)=>state.setStudentsPopup);
	const settingsStudentsIndex= cs((state)=>state.settingsStudentsIndex);
	const classes = cs((state) => state.classes);

	const deleteStudent = cs((state) => state.deleteStudent);

	const deleteAssignment = cs((state) => state.deleteAssignment);
	const setAssignmentIndividualStudent = cs((state) => state.setAssignmentIndividualStudent);

 function nothing() {

 }


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
				<div className="fixed flex h-full w-full justify-center items-center bg-black/90" onClick={() => setStudentsPopup(false)}>
					<div className="bg-black  z-10 h-2/3 w-2/3  flex justify-center items-center border-1 border-zinc-400"  onClick={(e) => e.stopPropagation()}>
						<div className=" h-[500px] w-3/4 bg-blue">
							<p><b>{classes[settingsClassIndex].students[settingsStudentsIndex].name}'s</b> Stuff</p>			
							<br></br>
							
							<div className="flex items-center gap-[10px] mb-[5px]">
								<p><b>Assignments:</b></p>
							</div>
							<div className="flex gap-[10px]">		
								<textarea
									placeholder="Enter Assignment Name"
									className="text-white w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "

									></textarea>
								<Btn text="Search" onclick={()=>nothing()}/>
							</div>
							<br></br>
							<div className="flex flex-wrap w-full gap-y-[10px] h-1/2  overflow-y-auto">
								<p>{classes[settingsClassIndex].students[settingsStudentsIndex].assignments.length == 0 ? "Student has finished all of his assignments." : ""}</p>
								{classes[settingsClassIndex].students[settingsStudentsIndex].assignments.map((assignment, index) => (
									<div key={index} className="h-full w-full gap-[10px] border-1 border-zinc-800 p-5 flex bg-gray-900 flex-col">

										<div className="flex justify-between items-center">
											
											<p>{assignment.name}</p>
											<div className="w-1/4 border-1 border-red-700">
												<Btn onclick={() => {deleteAssignment(settingsClassIndex, settingsStudentsIndex, index)/*students[settingsStudentsIndex].assignments[index]*/}} text="Delete Assignment"/>
											</div>
										</div>
										<div className="flex items-center gap-x-[10px]">
											<p className="">Grade:</p>
											<input
												placeholder="Enter Assignment Name"
												className="text-white w-1/10 resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans"
												type={"number"}
												value={assignment.grade}
												onChange={(e)=>{setAssignmentIndividualStudent(settingsClassIndex, settingsStudentsIndex, index, e.target.value, "grade")}}
											></input>
											<p className="text-[20px]">%</p>
										</div>

										
										<p>Completed: {String(assignment.isDone)}</p>
									</div>
								))}
								
							</div>
							<br></br>
							<div className="flex gap-[10px]">
								<div className="flex w-1/3"><Btn text="Delete student" onclick={()=> deleteStudent(settingsClassIndex, settingsStudentsIndex)}/></div>
								<div className="flex w-2/3"><Btn text="Close" onclick={() => setStudentsPopup(false)}/></div>
							</div>
						</div>
					</div>
				</div>
 );
}
// next time i will:
// link classes class with server, which is going to be easy.
// 