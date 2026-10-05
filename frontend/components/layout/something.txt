"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";
import Footer from "@/components/layout/footer";
import { a, i } from "framer-motion/client";
import Header from "@/components/layout/header";
import { cs } from "@/lib/classStore";

interface Class {
	id: number;
	className: string;
	students : Test[];
	color: string;
	canShow : boolean;
	assignments: Assignment[];
	announcements: Announcement[];
}

interface Test {
  id: number;
  name: string;
  text: string;
	grade: string;
	assignments: Assignment[];
	announcements: Announcement[];
}

interface Assignment {
	id: number;
	name: string;
	text: string;
	link: string;
	grade: number;
	isDone: boolean;
}

interface Announcement {
	id: number;
	text: string;
	date: string;
}

export default function ClassBody() {
	
	//const [test, setTest] = useState<Test[]>([]);
	//const [classes, setClasses] = useState<Class[]>([]);
  const [asd, setAsd] = useState("");

	//settings stuff
	const [settingsPopup, setSettingsPopup] = useState(false);
	const [settingsClassIndex, setSettingsClassIndex] = useState(-1);

	// student info
	const [studentsPopup, setStudentsPopup] = useState(false);
	const [settingsStudentsIndex, setSettingsStudentsIndex] = useState(-1);

	// assignments info
	const [assignmentsPopop, setAssignmentsPopup] = useState(false);
	const [textAreaAssignment, setTextAreaAssignment] = useState("");
	const [untitledCount, setUntitledCount] = useState(0);

	// messaging info
	const [messagePopup, setMessagePopup] = useState(false);
	const [announcementInput, setAnnoucementInput] = useState("");


	

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

	const classes = cs((state) => state.classes);
	const setClasses = cs((state) => state.setClasses);
	const addClass = cs((state) => state.addClass);
	const addStudent = cs((state) => state.addStudent);
	const setClassName = cs((state)=> state.setClassName);
	const deleteClass = cs((state)=>state.deleteClass);
	const subAddStudent = cs((state) => state.subAddStudent);
	const deleteStudent = cs((state) => state.deleteStudent);
	const setStudentname = cs((state) => state.setStudentName);
	const addAssignments = cs((state) => state.addAssignments);
	const addClassAssignment = cs((state) => state.addClassAssignment);
	const addAssignmentsToStudents = cs((state) => state.addAssignmentsToStudents);
	const deleteAssignmentToStudent = cs((state) => state.deleteAssignmentToStudents);
	const addAnnouncementsToStudents = cs((state) => state.addAnnouncementsToStudents);
	const addClassAnnouncement = cs((state) => state.addClassAnnouncement);
	const deleteAssignment = cs((state) => state.deleteAssignment);
	const deleteAssignmentClassByName = cs((state) => state.deleteAssignmentClassByName);
	const setAssignmentClass = cs((state) => state.setAssignmentClass);
	const setAssignmentStudent = cs((state) => state.setAssignmentStudent);
	const setAssignmentIndividualStudent = cs((state) => state.setAssignmentIndividualStudent);
	const setAnnouncementClass = cs((state) => state.setAnnouncementClass);
	const setAnnouncementStudent = cs((state) => state.setAnnouncementStudent);
	const setAnnouncementIndividualStudent = cs((state) => state.setAnnouncementIndividualStudent);
	const checkClassAssignmentName = cs((state) => state.checkClassAssignmentName);
	const changeClassBorderColor = cs((state) => state.changeClassBorderColor);
	const updateCanShowStudents = cs((state)=>state.updateCanShowStudents);

	function nothing() {

	}

	function functionSetSettings({id, className, students, canShow} : Class) {
		setSettingsClassIndex(id);
		setSettingsPopup(true);
	}

	function functionSetStudent(classIndex : number, studentIndex : number) {
		setStudentsPopup(true);
		setSettingsClassIndex(classIndex);
		setSettingsStudentsIndex(studentIndex);
	}

	function functionSetAssignment(classIndex : number) {
		setSettingsClassIndex(classIndex);
		setAssignmentsPopup(true);
	}

	function functionSetMessage(classIndex : number, studentIndex : number) {
		setMessagePopup(true);
		setSettingsClassIndex(classIndex);
	}

	const [image, setImage] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];

		if (!file) return;

		setImage(URL.createObjectURL(file));

		setFile(file);
		console.log(file.type);
	}


  return (
		
    <div className="bg-[#131313]">

			{settingsPopup && settingsClassIndex != -1 && (
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
			)}
			{studentsPopup && (
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
			)}

			{ assignmentsPopop && (
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
			)}

			{ messagePopup && (
				<div className="fixed flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto  flex-col flex-wrap" onClick={() => setMessagePopup(false)}>
					<div className="bg-black/90  z-10 overflow-y-auto w-2/3  flex justify-center items-center border-1 border-zinc-400 "  onClick={(e) => e.stopPropagation()}>
						<div className=" h-[500px] w-3/4 bg-blue">
							<br></br>
							<div className="flex justify-between">
								<p className="text-[30px]"><b>Manage Announcements📢</b></p>
								<div className="w-[100px]"><Btn onclick={()=>setMessagePopup(false)} text="Close"/></div>
							</div>
							<br></br>
							<div className="h-full w-full gap-[10px] border-1 border-zinc-800 p-5 flex bg-gray-900 flex-col">
								<p>Make Announcement:</p>
								<textarea
									placeholder="Type Announcement Here:"
									className="text-white w-full resize-none h-1/5 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans mt-[10px]"
									value={announcementInput}
									onChange={(e)=>setAnnoucementInput(e.target.value)}
								></textarea>
								<div className="w-1/3 my-[20px] border-1 border-yellow-800"><Btn onclick={()=> {addClassAnnouncement(settingsClassIndex, announcementInput,untitledCount);addAnnouncementsToStudents(settingsClassIndex, announcementInput,announcementInput,untitledCount)}} text="Post"/></div>
							</div>
							<br></br>
							<p>Previous Announcements:</p>
							<br></br>
							<div className="overflow-y-auto ">
								{classes[settingsClassIndex].announcements.map((announcement, announcementIndex) => (
									<div key={announcementIndex} className="h-full w-full gap-[10px] border-1 border-zinc-800 p-5 flex bg-gray-900 flex-col">
										<p><b>{announcement.date}</b></p>
										<textarea
									placeholder="Enter Assignment Name"
									className="text-white w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "
										value={announcement.text}
										onChange={(e)=>{setAnnouncementClass(settingsClassIndex, announcementIndex, e.target.value, "text"); setAnnouncementStudent(settingsClassIndex, announcementIndex, e.target.value, "text")}}
										></textarea>

									</div>
								))}
							</div>
							<br></br>
							<Btn onclick={()=>setMessagePopup(false)} text="Close"/>
							<br></br>
							<br></br>
						</div>
					</div>
				</div>
			)}


			<div className="flex justify-end p-[10px] items-center bg-pink-900">
				<div className="w-[50px]">
					<Btn onclick={()=>nothing()} text="?"/>
				</div>
			</div>
			<Header headerText = {(
				<div className="flex justify-center flex-col items-center">
					<p className="text-[30px] text-center">Class Dashboard</p>
					<p>hmmm</p>

				</div>)} />
			
      <div

        style={{
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          padding: 10,
        }}
      >
				<div className="flex w-2/3">
					<Btn text="Add Section" onclick={()=>addClass()} />
				</div>
				<p>{classes.length == 0 ? "No classes to show. Create one on the top-left!" : ""}</p>
        {classes.map((item, i) => (
          <div

            key={i}
            style={{
              width: "80%",
              padding: "15px",
              borderRadius: "8px",
							gap: "10px"
            }}
						className={"border-1 "+classes[i].color+" hover:border-white"}
          >

            <p>#{item.id}</p>
						
						<div className="flex gap-10 align-middle justify-center">
							<textarea
								placeholder="Enter Class Name"
								className="text-white w-full resize-none h-16 p-2 border border-black hover:border-zinc-800 pt-4 text-[20px] font-sans "

								value={item.className}
								onChange={(e) => {
									//updateName(i, e.target.value, "className", );
									setClassName(i, e.target.value, "className")
								}}
							></textarea>
							<div className="w-[100px] flex align-middle">
								<Btn onclick={() => functionSetSettings(classes[i])} text="Settings"/>
							</div>
						</div>
						<br></br>
      <div className="w-2/3 flex">
      	<Btn text="Manage Announcement 📢" onclick={() => functionSetMessage(i, 0)}/>
      	<Btn text="Manage Assignments" onclick={() => functionSetAssignment(i)}/>
      </div>
      <br></br>
						<div className="w-2/3 flex">
						<Btn text="Add Student 🧑‍🎓" onclick={() => {classes[i].canShow = true;addStudent(item.students, i)}}/>
						<Btn text={classes[i].canShow ? "Hide Students" : "Show Students"} onclick={() => updateCanShowStudents(i, !classes[i].canShow)}/>

						</div>
						{classes[i].canShow && (
							<div>
								<p className="mt-10"><b>Students:</b></p>
								<p>{classes[i].students.length == 0 ? "No students in your class currently." : ""}</p>
							{item.students.map((studentTest, j) => (
								<div key={j}>
									<div style={{display: "flex", marginTop: "10px"}} className="w-full justify-between h-full">
										<div className="w-1/2 flex items-center gap-2.5">
											<p>#{j}</p>

											<textarea
												placeholder="Enter Student Name Here"
												className="text-white w-full resize-none h-12 p-2 border border-black hover:border-zinc-800 pt-2.5 text-[18px] font-sans"
												value={studentTest.name}
												onChange={(a) => setStudentname(i, j, a.target.value, "name")}
											/>
										</div>
										<div className="w-1/4 flex justify-center  h-full flex-col gap-2">
											<Btn text="Edit Student Info" onclick={() => {functionSetStudent(i, j)}}/>
											<Btn text="Message" onclick={()=>nothing()}/>
										</div>
									</div>
									<br></br>
								</div>
							))}
							</div>
						)}

						<br></br>
						<br></br>
      <br></br>
						<div className="w-1/3">
						</div>
          </div>
    ))}
					<div>
			<input
				type="file"
				onChange={handleImage}
			/>

			{image && file && file.type == "text/plain" && (
				<img
					src={image}
					alt="Uploaded"
					className="w-40 h-40 object-cover"
				/>
			)}

			{image && file && file.type == ""}
			

		</div>
			<br></br>
      </div>
			<br></br>
   
			<p className="ml-10">Brought to you by RespectableDot because he is very respectful. </p>

   <br></br>
			<Footer/>
			<div className="h-100"></div>
    </div>
		
  );
}
