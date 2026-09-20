"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";
import Footer from "@/components/layout/footer";

interface Class {
	id: number;
	className: string;
	students : Test[];
	canShow : boolean;
}

interface Test {
  id: number;
  name: string;
  text: string;
}

export default function ClassBody() {
	
	//const [test, setTest] = useState<Test[]>([]);
	const [classes, setClasses] = useState<Class[]>([]);
  const [asd, setAsd] = useState("");
	
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

	// index class
	function returnStudentList(index: number) {
		let currentStudentList: Test[] | null = null;
		currentStudentList = classes[index].students;
		return currentStudentList;
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
				canShow: true
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

	function subDeleteStudent(students: Test[], studentIndex : number) {
    students.filter((_, j) => j !== studentIndex);
		return students;
	}

	

	function returnStudents(index : number) {
		let total = "";
		for(let i = 0; i < classes[index].students.length; i++) {
			total += classes[index].students[i].name + " ";
		}
		return total;
	}

	

  return (
    <div className="bg-[#131313]">
      <header
        style={{
          display: "flex",
					flexDirection: "column",
          gap: "20px",
          height: "150px",
          alignItems: "center",
          padding: 10,
          borderTop: "1px solid gray",
          borderBottom: "1px solid gray",
					justifyContent: "center"
				
        }}
      >

				<p style={{fontSize: "20px"}}><b>DashBoard</b></p>
				<p>Hmm</p>
				<p></p>
      </header>
			
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
						className="border-1 border-zinc-800 "
						
          >

            <p>#{item.id}</p>
						

						<textarea
							placeholder="Enter Class Name"
							className="text-white w-full resize-none h-16 p-2 border border-black hover:border-zinc-800 pt-4.5 text-[18px] font-sans"

						value={item.className}
						onChange={(e) => {
							updateName(i, e.target.value);
						}}
						></textarea>
						<div className="w-2/3 flex">
						<Btn text="Add Student" onclick={() => {classes[i].canShow = true;addStudent(item.students, i)}}/>
						<Btn text={classes[i].canShow ? "Hide" : "Show"} onclick={() => updateCanShowStudents(i, !classes[i].canShow)}/>

						</div>
						{classes[i].canShow && (
							<div>
								<p className="mt-10"><b>Students:</b></p>
								<p>{classes[i].students.length == 0 ? "No students in your class currently." : ""}</p>
							{item.students.map((studentTest, j) => (
								<div key={j}>
									<div style={{display: "flex", marginTop: "10px"}} className="w-full justify-between h-full">
										<div className="w-2/3">
											<p>#{j} {studentTest.name == "" ? "[Untitled]" : studentTest.name}</p>
											<textarea placeholder="Enter Student Name Here" className="text-white dark:text-zinc-300 text-sm w-2/3 resize-none h-15 bg-[#333333] p-2 mt-2" value={studentTest.name} onChange={(e) => { updateStudentName(i, j, e.target.value)}}></textarea>
										</div>
										<div className="w-1/4 flex justify-center  h-full flex-col gap-2">
											<Btn text="Edit Student Info" />
											<Btn text="Delete Student" onclick={() => {deleteStudent(i, j)}}/>
										</div>
									</div>

									<br></br>
								</div>
							))}
							</div>
						)};

						<br></br>
						
						<div className="w-1/3">
						<Btn text="Delete Class" onclick={() => {deleteTest(i)}}/>
						</div>
          </div>
        ))}
      </div>
			<br></br>
			
			<Footer/>
			<div className="h-100"></div>
    </div>
		
  );
}

/*
						<p className="mt-10"><b>Students:</b></p>
						{item.students.map((studentTest, j) => (
							<div key={j}>
								<div style={{display: "flex", marginTop: "10px"}} className="w-full justify-between h-full">
									<div className="w-2/3">
										<p>#{j} {studentTest.name == "" ? "[Untitled]" : studentTest.name}</p>
										<textarea placeholder="Enter Student Name Here" className="text-white dark:text-zinc-300 text-sm w-2/3 resize-none h-15 bg-[#333333] p-2 mt-2" value={studentTest.name} onChange={(e) => { updateStudentName(i, j, e.target.value)}}></textarea>
									</div>
									<div className="w-1/4 flex justify-center  h-full flex-col gap-2">
										<Btn text="Edit Student Info" />
										<Btn text="Delete Student" onclick={() => {deleteStudent(i, j)}}/>
									</div>
								</div>

								<br></br>
							</div>
						))}
*/