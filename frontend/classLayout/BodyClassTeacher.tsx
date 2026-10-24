"use client"
import {cs} from "@/lib/classStore";
import Btn from "@/components/ui/btn";
import Header from "@/components/layout/header";
import "@/app/globals.css";

import AssignmentsPopupClassTeacher from "./assignmentsPopupClassTeacher";
import SettingsPopupClassTeacher from "./settingsPopupClassTeacher";
import MessagePopupClassTeacher from "./messagesPopupClassTeacher";
import StudentsPopupClassTeacher from "@/classLayout/studentsPopupClassTeacher";
import QuizPopup from "@/classLayout/quizPopupTeacher";

import AboutPopup from "@/components/layout/aboutPopup";


export default function BodyClassTeacher() {	

	
	const aboutPopup = cs((state)=> state.aboutPopup);
	const setAboutPopup = cs((state)=> state.setAboutPopup);

	const quizPopup = cs((state)=>state.quizPopup);
	const setQuizPopup = cs((state)=>state.setQuizPopup);

	const quizClassIndex = cs((state) => state.quizClassIndex);
	const setQuizClassIndex = cs((state)=> state.setQuizClassIndex);


	const settingsPopup = cs((state)=>state.settingsPopup);
	const setSettingsPopup = cs((state)=>state.setSettingsPopup);
	const settingsClassIndex = cs((state)=> state.settingsClassIndex);
	
	const setSettingsClassIndex = cs((state)=> state.setSettingsClassIndex);
	const studentsPopup = cs((state)=>state.studentsPopup);
	const setStudentsPopup = cs((state)=>state.setStudentsPopup);
	
	const settingsStudentIndex = cs((state)=>state.settingsStudentsIndex);
	const setSettingsStudentsIndex= cs((state)=>state.setSettingsStudentsIndex);

	const assignmentsPopup = cs((state)=>state.assignmentsPopup);
	const setAssignmentsPopup = cs((state)=>state.setAssignmentsPopup);
	const messagePopup = cs((state)=>state.messagePopup);
	const setMessagePopup = cs((state)=>state.setMessagePopup);
	const setStudentname = cs((state) => state.setStudentName);


	const classes = cs((state) => state.classes);
	const addClass = cs((state) => state.addClass);
	const addStudent = cs((state) => state.addStudent);
	const setClassName = cs((state)=> state.setClassName);

	const updateCanShowStudents = cs((state)=>state.updateCanShowStudents);

	function functionSetQuizzes(classIndex:number) {
		setQuizPopup(true);
		setQuizClassIndex(classIndex);
		setSettingsClassIndex(classIndex);
		console.log(quizClassIndex + " " + quizPopup);
	}

	function functionSetSettings(id:number){//{id, className, students, canShow} : Class) {
		
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

	function functionSetMessage(classIndex : number) {
		setMessagePopup(true);
		setSettingsClassIndex(classIndex);
	}
	function functionSetAbout() {
		setAboutPopup(true);
		
	}

 function nothing() {}
 

 return (
  <div className="bg-black flex items-center flex-col">
						{messagePopup && <MessagePopupClassTeacher/>}
						{settingsPopup && <SettingsPopupClassTeacher/>}
						{assignmentsPopup && <AssignmentsPopupClassTeacher/>}
						{studentsPopup && settingsStudentIndex != -1 && <StudentsPopupClassTeacher/>}
						{quizPopup && <QuizPopup/>}
						{aboutPopup && <AboutPopup/>}

						<Header headerText={
							<p className="text-[30px]"><b>Welcome Back, Dih</b></p>
						}/>


				<div className="flex w-full gap-[10px] border-b-1 border-t-1 border-white items-center bg-gray-800 p-[10px] justify-between">

							
							<div className="flex">
								<div className="flex border-1 border-white p-[10px] items-center justify-center ">
									<input className="text-white w-3/4 p-2 active:border-none"/*text-white w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans */ placeholder="Sreach Class Here:"></input>
		<Btn text="Search" onclick={()=>addClass()}/>

									</div>
									<Btn text="Add Class" onclick={()=>addClass()} />
							<Btn text="Sort By" onclick={()=>nothing()}/>
								
							</div>

							<div className="flex gap-[10px]">
								<Btn text="About" onclick={()=>functionSetAbout()}/>
								<Btn text="Settings" onclick={()=>nothing()} />
							</div>
					


				</div>
				<br></br>

				<p>{classes.length == 0 ? "No classes to show. Create one on the top-left!" : ""}</p>
							<div className="gap-[20px] w-full flex flex-col items-center justify-center">
								        {classes.map((item, i) => (
          <div
            key={i}
            style={{
              width: "80%",
              padding: "15px",
              borderRadius: "8px",
							gap: "10px",
														marginBottom: "20px"
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
									setClassName(i, e.target.value, "className")
								}}
							></textarea>
							<div className="w-[100px] flex align-middle">
								<Btn onclick={() => functionSetSettings(i)} text="Settings"/>
							</div>
						</div>
						<br></br>
      <div className="w-2/3 flex">
      	<Btn text="Manage Announcement 📢" onclick={() => functionSetMessage(i)}/>
      	<Btn text="Manage Assignments" onclick={() => functionSetAssignment(i)}/>
								<Btn text="Manage Quizzes" onclick={() => functionSetQuizzes(i)}/>
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
							</div>
					<div>
			

		</div>
			<br></br>
      </div>
 );
}
