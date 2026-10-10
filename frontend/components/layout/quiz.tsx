"use state"
import {cs} from "@/lib/classStore";
import "@/app/globals.css";

export default function QuizBody() {
 
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

 const addClassQuiz = cs((state) => state.addClassQuiz);
 const deleteClassQuiz = cs((state) => state.deleteClassQuiz);
 const setClassQuiz = cs((state) => state.setClassQuiz);
 
 const addQuizQuestion = cs((state) => state.addQuizQuestion);
 const deleteQuizQuestion = cs((state) => state.deleteQuizQuestion);
 const setQuizQuestion = cs((state) => state.setQuizQuestion);
 
 return (
  <div>

  </div>
 );
}