"use client"

import {useState} from "react";
import {cs} from "@/lib/classStore";
import Btn from "@/components/ui/btn";

export default function assignmentsPopupClassTeacher() {

	const settingsClassIndex = cs((state)=> state.settingsClassIndex);


	const setAssignmentsPopup = cs((state)=>state.setAssignmentsPopup);
	const untitledCount = cs((state)=>state.untitledCount);
	const setUntitledCount = cs((state)=>state.setUntitledCount);
	const classes = cs((state) => state.classes);
	const addClassAssignment = cs((state) => state.addClassAssignment);
	const addAssignmentsToStudents = cs((state) => state.addAssignmentsToStudents);
	const deleteAssignmentToStudent = cs((state) => state.deleteAssignmentToStudents);

	const deleteAssignmentClassByName = cs((state) => state.deleteAssignmentClassByName);
	const setAssignmentClass = cs((state) => state.setAssignmentClass);
	const setAssignmentStudent = cs((state) => state.setAssignmentStudent);

	const checkClassAssignmentName = cs((state) => state.checkClassAssignmentName);


 function nothing() {

 }


 return (
    <div className="fixed flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto  flex-col flex-wrap" onClick={() => setAssignmentsPopup(false)}>
					<div className="bg-black/90  z-10 h-2/3 w-2/3  flex justify-center items-center border-1 border-zinc-400 overflow-y-auto"  onClick={(e) => e.stopPropagation()}>
						<div className=" h-[500px] w-3/4 bg-blue">
							<div className="flex justify-end items-center">
								<div className="w-1/5">
								
									<Btn text="Close"onclick={() => setAssignmentsPopup(false)}></Btn>
								</div>
							</div>
							<br></br>
							<p className="mb-1 "><b>Search for Assignment</b></p><br></br>

							<div className="flex gap-[10px]">		
								<textarea
									placeholder="Enter Assignment Name"
									className="text-white w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "

									></textarea>
								<Btn text="Search" onclick={()=>nothing()}/>
							</div>
							<br></br>

							<div className="flex w-1/3">	
								<Btn onclick={()=>{addClassAssignment(settingsClassIndex,untitledCount); addAssignmentsToStudents(settingsClassIndex, untitledCount); setUntitledCount(untitledCount+1)} } text="Add assignment"/>
							</div>
							<br></br>

							<div className=" ">
								<p>{classes[settingsClassIndex].assignments.length == 0 ? "Make an assignment to get started with your class!" : ""}</p>
								{classes[settingsClassIndex].assignments.map((assignment, assignmentIndex) => (
									
									<div className="h-full w-full gap-[10px] border-1 border-zinc-800 p-5 flex bg-gray-900 flex-col mb-[15px]" key={assignmentIndex}>
										<div className="h-1/5 w-full flex">
											<input
												placeholder="Enter Assignment Name"
												className="text-white w-2/3 resize-none h-full p-2 border-gray-900 border-1 hover:border-zinc-600 text-[18px] font-sans "
												value={assignment.name}
												onChange={(e)=>{setAssignmentClass(settingsClassIndex, assignmentIndex, e.target.value, "name"); setAssignmentStudent(settingsClassIndex, assignmentIndex, assignment.name, "name")}}
												onBlur={()=>{checkClassAssignmentName(settingsClassIndex, assignment.name, assignmentIndex, assignment.name, untitledCount);setUntitledCount(untitledCount+1)}}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														checkClassAssignmentName(settingsClassIndex, assignment.name, assignmentIndex, assignment.name,untitledCount);
														setUntitledCount(untitledCount+1);
													}
												}}
											></input>
											<br></br>
											<br></br>
											<div className="flex w-1/3 border-1 border-zinc-600">
												<Btn onclick={()=>{deleteAssignmentToStudent(settingsClassIndex, assignment.name); deleteAssignmentClassByName(settingsClassIndex, assignment.name)}} text="Delete Assignment"/>
											</div>
										</div>
										<textarea className="text-white w-full resize-y h-2/5 p-2 border-1 border-zinc-600/0 hover:border-zinc-600 text-[18px] font-sans " placeholder="Description of assignment" value={assignment.text} onChange={(e)=>{setAssignmentClass(settingsClassIndex, assignmentIndex, e.target.value, "text")}}></textarea>
										
										<input className="text-blue-400 underline w-full resize-none h-[50px] p-2 border-gray-900 border-1 hover:border-zinc-600 text-[18px] font-sans" placeholder="Link to assginment" onChange={(e) => {setAssignmentClass(settingsClassIndex, assignmentIndex, e.target.value, "link"); setAssignmentStudent(settingsClassIndex, assignmentIndex, assignment.name, "link")}}></input>

										<p className="p-2">Students who were assigned:</p>
										<div><Btn onclick={() => nothing()}text="Show"/></div>


									</div>
								))}
							</div>
							<br></br>

							<Btn text="Close"onclick={() => setAssignmentsPopup(false)}></Btn>
							<br></br>
							<br></br>
						</div>

					</div>
				</div>
 );
}