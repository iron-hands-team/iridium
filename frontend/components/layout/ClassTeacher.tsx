"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";
import Footer from "@/components/layout/footer";
import { a } from "framer-motion/client";
import Header from "@/components/layout/header";
import { hasUncaughtExceptionCaptureCallback } from "process";

interface Class {
	id: number;
	className: string;
	students : Test[];
	color: string;
	canShow : boolean;
	assignments: Assignment[];
}

interface Test {
  id: number;
  name: string;
  text: string;
	assignments: Assignment[];
}

interface Assignment {
	id: number;
	name: string;
	text: string;
}

export default function ClassBody() {
	
	//const [test, setTest] = useState<Test[]>([]);
	const [classes, setClasses] = useState<Class[]>([]);
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

	function updateCanShowStudents(index: number, canShow: boolean) {
		setClasses((prev) => 
				prev.map((item, i) => 
					i === index ? { ...item, canShow : canShow} : item
			)
		);
	}


	function updateName(index: number, text: string) {
    setClasses((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, className: text }
          : item
      )
    );
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

	// index class, text = string
	// dih
	// dih
	function updateStudentName(index: number, studentIndex : number, text: string) {
		setClasses((prev) =>
      prev.map((item, i) =>
        i === index
          ? 
					{...item, students : subUpdateStudentName(item.students, studentIndex, text)}
          : item
      )
    );
	}

		function subUpdateStudentName( students: Test[], studentIndex: number, text: string) {
				return students.map((student, i) =>
						i === studentIndex
								? { ...student, name : text }
								: student
				);
		}

	function deleteTest(index : number) {
		setClasses((prev) => prev.filter((_, i) => i !== index));
	}

	function addClass() {
    setClasses((prev) => [
      ...prev,
      {
        id: prev.length,
				className: "",
				students: [],
				color: "border-zinc-500",
				canShow: false,
				assignments: []
      },
    ]);
  }

  function addStudent(students : Test[], classIndex : number) {

		setClasses((prev) =>
      prev.map((item, i) =>
        i === classIndex
          ? 
					{...item, students : subAddStudent(item.students)}
          : item
      )
    );
		//					{...item, students : subAddStudent(item.students)}

  }

	function subAddStudent(students: Test[]) {
			return [
					...students,
					{
							id: students.length,
							name: "Untitled",
							text: "",
							assignments: []
					}
			];
	}

	function deleteStudent(classIndex : number, studentIndex :number ) {
		setClasses((prev) =>
      prev.map((item, i) =>
        i === classIndex
          ? 
					{...item, students : item.students.filter((_, j) => j !== studentIndex, studentIndex)}
          : item
      )
    );
	}
	

	function nothing() { // test
	}
	
	// ai generated.
	function addAssignments(classIndex: number, studentIndex: number) {
		setClasses((prev) =>
			prev.map((item, i) =>
				i === classIndex
					? {
							...item,
							students: item.students.map((student, j) =>
								j === studentIndex
									? {
											...student,
											assignments: [
												...student.assignments,
												{
													id: student.assignments.length,
													name: "Untitled Assignment",
													text: ""
												}
											]
										}
									: student
							)
						}
					: item
			)
		);
	}

	function addClassAssignment(classIndex: number) {
		setClasses((prev) =>
			prev.map((item, i) =>
				i === classIndex
					? {
							...item,
							assignments: [
								...item.assignments,
								{
									id: item.assignments.length,
									name: "Untitled Assignment",
									text: ""
								}
							]
						}
					: item
			)
		);
	}

	function addAssignmentsToStudents(classIndex : number) {
		classes[classIndex].students.map((studentClass, studentIndex) => (
			addAssignments(classIndex, studentIndex)
		));
	}
	
	//sory for ai generating this part.
	function setAssignment(
		classIndex: number,
		studentIndex: number,
		assignmentIndex: number,
		name: string,
		text: string
	) {
		setClasses((prev) =>
			prev.map((item, i) =>
				i === classIndex
					? {
							...item,
							students: item.students.map((student, j) =>
								j === studentIndex
									? {
											...student,
											assignments: student.assignments.map(
												(assignment, k) =>
													k === assignmentIndex
														? {
																...assignment,
																name: name,
																text: text
															}
														: assignment
											)
										}
									: student
							)
						}
					: item
			)
		);
	}
	function deleteAssignment(
		classIndex: number,
		studentIndex: number,
		assignmentIndex: number
	) {
		setClasses((prev) =>
			prev.map((item, i) =>
				i === classIndex
					? {
							...item,
							students: item.students.map((student, j) =>
								j === studentIndex
									? {
											...student,
											assignments: student.assignments.filter(
												(_, k) => k !== assignmentIndex
											)
										}
									: student
							)
						}
					: item
			)
		);
	}
	function ChangeClassBorderColor(index : number, color : string) {
		setClasses((prev) => (
			prev.map((item, i) => i == index ? {...item, color : color} : item)
		));
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
											<button className= {" w-full h-full py-2 border-1 cursor-pointer " + buttonColors[name]} onClick={() => ChangeClassBorderColor(settingsClassIndex, value)}><p>{name}</p></button>
										</div>
								))}
							</div>
							<br></br>

							<div></div>

							<p className="text-[20px]">Delete Class</p>
							
							<Btn text="Delete Class" onclick={() => {deleteTest(settingsClassIndex); setSettingsPopup(false)}}/>
				
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
						<div className=" h-[500px] w-[500px] bg-blue">
							<p><b>{classes[settingsClassIndex].students[settingsStudentsIndex].name}'s</b> Stuff</p>			
							<br></br>				
							<div className="flex items-center gap-[10px]">
								<p><b>Assignments:</b></p>
								<div className="w-2/3"><Btn onclick={()=>addAssignments(settingsClassIndex, settingsStudentsIndex)} text="Add Assignment for Student"/></div>
							</div>
							<br></br>
							<div className="flex flex-wrap w-full gap-y-[10px] h-1/2 bg-blue-500 overflow-y-auto">
								<p>{classes[settingsClassIndex].students[settingsStudentsIndex].assignments.length == 0 ? "Student has finished all of his assignments." : ""}</p>
								{classes[settingsClassIndex].students[settingsStudentsIndex].assignments.map((assignment, index) => (
									<div key={assignment.id} className="w-full h-[100px] bg-red-500">
										<p>{assignment.name}</p>
										<div className="w-2/3">
										
										
										<Btn onclick={() => {deleteAssignment(settingsClassIndex, settingsStudentsIndex, index)/*students[settingsStudentsIndex].assignments[index]*/}} text="Delete Assignment for student"/>

										</div>
									</div>
								))}
								
							</div>
							<br></br>
							<Btn text="Delete student" onclick={()=> deleteStudent(settingsClassIndex, settingsStudentsIndex)}/>
							<br></br>
							<br></br>
							<Btn text="Close" onclick={() => setStudentsPopup(false)}/>
						</div>
					</div>
				</div>
			)};

			{ assignmentsPopop && (
				<div className="fixed flex h-full w-full justify-center items-center bg-black/90" onClick={() => setAssignmentsPopup(false)}>
					<div className="bg-black  z-10 h-2/3 w-2/3  flex justify-center items-center border-1 border-zinc-400"  onClick={(e) => e.stopPropagation()}>
						<div className=" h-[500px] w-[500px] bg-blue">
							<p className="text-[30px]">PLuh</p>
							<div className="flex">						
								<textarea
									placeholder="Enter Assignment Name"
									className="text-white w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "
									value={textAreaAssignment}
									onChange={(e)=>{setTextAreaAssignment(e.target.value)}}
								></textarea>
								<Btn text="Add Assignments" onclick={()=>{addClassAssignment(settingsClassIndex);addAssignmentsToStudents(settingsClassIndex)}}/>
							</div>
							<br></br>
							{classes[settingsClassIndex].assignments.map((assignments, assignmentIndex) => (
								
							))}
							<br></br>

							<Btn text="Close"onclick={() => setAssignmentsPopup(false)}></Btn>
						</div>

					</div>
				</div>
			)}





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
					<Btn text="Add Section" onclick={addClass} />
				</div>
				<p>{classes.length == 0 ? "No classes to show. Create one on the top-left!" : ""}</p>
        {classes.map((item, i) => (
          <div

            key={item.id}
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
									updateName(i, e.target.value);
								}}
							></textarea>
							<div className="w-[100px] flex align-middle">
								<Btn onclick={() => functionSetSettings(classes[i])} text="Settings"/>
							</div>
						</div>
						<br></br>
      <div className="w-2/3 flex">
      	<Btn text="Make an Announcement 📢" onclick={() => nothing()}/>
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
												onChange={(a) => updateStudentName(i, j, a.target.value)}
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
