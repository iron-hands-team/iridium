"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";

interface Class {
	id: number;
	className: string;
	students : Test[];
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
				students: []
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
					{...item, students : subDeleteStudent(classes[classIndex].students, studentIndex)}
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
      <div
        style={{
          display: "flex",
          gap: "20px",
          height: "70px",
          alignItems: "center",
          padding: 10,
          borderTop: "1px solid gray",
          borderBottom: "1px solid gray",
        }}
      >
        <Btn text="Add Section" onclick={addClass} />

        <Btn
          text="Delete Section"
          onclick={() => deleteTest(classes.length - 1)}
        />
      </div>

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
						
            <p>{item.className == "" ? "[Untitled]" : item.className}</p>
						<textarea              className="text-white dark:text-zinc-300 text-sm w-1/2 resize-none h-15 bg-[#333333] p-2"
						value={item.className}
						onChange={(e) => {
							updateName(i, e.target.value);
						}}
						></textarea>

						<Btn text="Add Student" onclick={() => addStudent(item.students, i)}/>

						<p>Students:</p>
						{item.students.map((studentTest, j) => (
							<div key={j}>
								<div style={{display: "flex", marginTop: "10px"}} className="w-full">
									<div className="w-full ">
										<p>#{j} {studentTest.name == "" ? "[Untitled]" : studentTest.name}</p>
										<textarea placeholder="Enter Student Name Here" className="text-white dark:text-zinc-300 text-sm w-1/2 resize-none h-15 bg-[#333333] p-2" value={studentTest.name} onChange={(e) => { updateStudentName(i, j, e.target.value)}}></textarea>
									</div>
									
									<Btn text="Delete Student" onclick={() => {let tempStudent = j;deleteStudent(i, j);}}/>
								</div>

								
							</div>
						))}
						<br></br>
						<Btn text="Delete Class" onclick={() => {deleteTest(i)}}/>

          </div>
        ))}
      </div>


    </div>
  );
}
