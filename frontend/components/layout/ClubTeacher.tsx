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
	
}

interface Test {
  id: number;
  name: string;
  text: string;
}

export default function ClubBody() {
	
	//const [test, setTest] = useState<Test[]>([]);
	const [classes, setClasses] = useState<Class[]>([]);
  const [asd, setAsd] = useState("");

	//settings stuff
	const [settingsPopup, setSettingsPopup] = useState(false);
	const [settingsClassIndex, setSettingsClassIndex] = useState(-1);

	
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
	

	function nothing() { // test
	}

	function ChangeClassBorderColor(index : number, color : string) {
		setClasses((prev) => (
			prev.map((item, i) => i == index ? {...item, color : color} : item)
		));
		
	}

  return (
		
    <div className="bg-[#131313]">
		</div>
	);
}
