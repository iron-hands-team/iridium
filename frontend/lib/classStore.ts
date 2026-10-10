import { create } from "zustand";

type Test = {
 id: number;
 name: string;
 text: string;
 grade: string;
 assignments: Assignment[];
 announcements: Announcement[];
};

type Class = {

 id: number;
 className: string;
 students: Test[];
 color: string;
 canShow : boolean;
 assignments: Assignment[];
 announcements: Announcement[];
	quizzes: Quiz[];
};

type Assignment = {
	id: number;
	name: string;
	text: string;
	link: string;
	grade: number;
	isDone: boolean;
}

type Announcement = {
	id: number;
	text: string;
	date: string;
}

type Quiz = {
	id: number,
	name: string,
	questions: QuizQuestion[];
}

type QuizQuestion = {
	id: number;
	question: string,
	choices: string[]
	answers: string[],
}


type ClassStore = {
 classes: Class[];
	annoucementInput: string;

	// quiz
	addClassQuiz: (classTargetIndex:number)=>void;
	deleteClassQuiz: (classTargetIndex:number, quizIndex:number) =>void;
	setClassQuiz: <T>(classTargetIndex:number, quizIndex:number, value:T, variableName:string)=>void;

	addQuizQuestion: (classTargetIndex:number, quizTargetIndex:number)=>void;
	deleteQuizQuestion: (classTargetIndex:number, quizTargetIndex:number, quizQuestionTargetIndex:number) =>void;
	setQuizQuestion: <T>(classTargetindex:number, quizTargetIndex:number, quizQuestionTargetIndex:number, value:T, variableName:string)=>void;

 // settings stuff
 settingsPopup: boolean;
 setSettingsPopup: (input:boolean) => void;
 settingsClassIndex: number;
 setSettingsClassIndex: (settingClassIndex:number)=>void;

 // student info
 studentsPopup: boolean;
 setStudentsPopup: (input:boolean) => void;
 settingsStudentsIndex : number;
 setSettingsStudentsIndex: (settingsStudentsIndex:number)=>void;

 //assignments info
 assignmentsPopup: boolean;
 setAssignmentsPopup: (input:boolean) => void;
 untitledCount: number;
 setUntitledCount: (untitledCount:number)=>void;

 //messaging info
 messagePopup: boolean;
 setMessagePopup: (input:boolean) => void;
 announcementInput: string;

	setCanShowStudents: (index:number, canShow:boolean) => void;
	setAnnouncementInput: (input: string) => void;

 setClasses: (classes: Class[]) => void;
 addClass: () => void;

 addStudent: (students : Test[], classIndex: number) => void;
	subAddStudent: (students: Test[]) => Test[];
	deleteStudent: (classIndex : number, studentIndex : number) => void;
	setStudentName: <T>(index:number, studentIndex:number, text:T, variableName:string) =>void;

	addAssignments: (classIndex : number, studentIndex : number, untitledCount : number) => void;

	addClassAssignment: (classIndex : number, untitledCount : number) => void;

	addAssignmentsToStudents: (classIndex : number, untitledCount : number) => void;

	deleteAssignmentToStudents: (classIndex: number, assignmentName: string) => void;

	addAnnouncementsToStudents:(classIndex : number, annoucement: string, textInput : string, untitledCount : number) => void;

	addClassAnnouncement: (classIndex:number, textInput:string, untitledCount:number) => void;

 deleteAssignment: (classIndex:number, studentIndex:number, assignmentIndex:number) => void;

	deleteAssignmentClassByName: (classIndex:number, assignmentName:string) => void;

	setAssignmentClass: <T>(classIndex:number, assignmentIndex: number, assignmentName: T, assignmentVariablename: string) => void;

	setAssignmentStudent: <T>(classIndex:number, assignmentIndex:number, assignmentName:T, assignmentVariableName:string) =>void;
	setAssignmentIndividualStudent: <T>(classIndex:number, studentIndex:number, assignmentIndex:number, assignmentName:T, assignmentVariableName:string)=>void;

	setAnnouncementClass: <T>(classIndex:number, assignmentIndex:number, assignmentName:T, assignmentVariableName:string) => void;


	setAnnouncementStudent: <T>(classIndex:number, assignmentIndex:number, assignmentName:T, assignmentVariableName:string) => void;

	setAnnouncementIndividualStudent: <T>(classIndex:number, studentIndex:number, assignmentIndex:number, assignmentName:T,assignmentVariableName:string) => void;

	checkClassAssignmentName: (classIndex:number, targetAssignmentname:string, targetindex:number, assignmentName:string, untitledCount:number) => void;

	changeClassBorderColor: (index:number, color:string) =>void;
	setClassName: <T>(classIndex:number, className:T, variableName:string)=>void;
	updateCanShowStudents: (classIndex:number,canShow:boolean)=>void;
	deleteClass: (classIndex:number) => void;
}
export const cs = create<ClassStore>((set) => ({
    classes: [],

				annoucementInput: "",

				//quiz question
				addClassQuiz: (classTargetIndex) => set((state) => ({
					classes: state.classes.map((classItem, classIndex) =>
						classIndex == classTargetIndex ? {...classItem, quizzes:
							[...classItem.quizzes, {
								id: 0,
								name: "",
								questions: []
							}]
						} : classItem
					)
				})),

				deleteClassQuiz: (classTargetIndex, quizIndex) => set((state) => ({
					classes: state.classes.map((classItem, classIndex) =>
					classIndex === classTargetIndex ? {...classItem, quizzes: classItem.quizzes.filter((_,i) => i !== quizIndex)}: classItem)
				})),

				setClassQuiz: (classTargetIndex, quizTargetIndex, value, variableName) => set((state)=> ({
					classes: state.classes.map((classItem, classIndex) =>
					classIndex === classTargetIndex ? {...classItem, quizzes: classItem.quizzes.map((quizItem, quizIndex) => ( quizIndex === quizTargetIndex ? { ...quizItem, [variableName]: value}:quizItem))} : classItem
				)
				})),


				addQuizQuestion: (classTargetIndex, quizTargetIndex) => set((state) => ({
					classes: state.classes.map((classItem, classIndex) =>
						classIndex === classTargetIndex ? {...classItem, quizzes: classItem.quizzes.map((quizItem, quizIndex) => ( quizIndex === quizTargetIndex ? { ...quizItem, questions: [...quizItem.questions, {id:0,question:"",choices: [], answers: []}]}:quizItem))} : classItem
					)
				})),

				deleteQuizQuestion: (classTargetIndex, quizTargetIndex, quizQuestionTargetIndex) => set((state) => ({
					classes: state.classes.map((classItem, classIndex) =>  classIndex === classTargetIndex ? {...classItem, quizzes: classItem.quizzes.map((quizItem, quizIndex) => quizIndex === quizTargetIndex ? {...quizItem, questions: quizItem.questions.filter((_,i) => i !== quizQuestionTargetIndex)} : quizItem)} : classItem)
				})),

			// FIX: this used to match on questionItem.id, but every question is created with
			// id hardcoded to 0 (see addQuizQuestion above), so this only ever matched the
			// first question in a quiz. Match on the array index instead, same as
			// deleteQuizQuestion already does.
			setQuizQuestion: (classTargetIndex, quizTargetIndex, quizQuestionTargetIndex, value, variableName) => set((state) => ({
					classes: state.classes.map((classItem, classIndex) =>  classIndex === classTargetIndex ? {...classItem, quizzes: classItem.quizzes.map((quizItem, quizIndex) => quizIndex === quizTargetIndex ? {...quizItem, questions: quizItem.questions.map((questionItem, questionIndex) => questionIndex === quizQuestionTargetIndex ? {...questionItem, [variableName]: value} : questionItem)} : quizItem)} : classItem)
				})),

    settingsPopup: false,
    setSettingsPopup: (settingsPopup) => set({settingsPopup}),

    settingsClassIndex: 0,
    setSettingsClassIndex: (settingsClassIndex) => set({settingsClassIndex}),

    studentsPopup: false,
    setStudentsPopup: (studentsPopup) => set({studentsPopup}),
    settingsStudentsIndex: 0,
    setSettingsStudentsIndex: (settingsStudentsIndex) => set({settingsStudentsIndex}),

    assignmentsPopup: false,
    setAssignmentsPopup: (assignmentsPopup) => set({assignmentsPopup}),
    untitledCount: 0,
    setUntitledCount: (untitledCount) =>set({untitledCount}),

    messagePopup: false,
    setMessagePopup: (messagePopup) => set({messagePopup}),

    announcementInput: "",
				setAnnouncementInput: (announcementInput) => set({announcementInput}),

    setClasses: (classes) => set({ classes }),

    addClass: () =>
     set((state) => ({
         classes: [...state.classes,
        	{
						id: state.classes.length,
						className: "Untitled",
						students: [],
						color: "border-zinc-500",
						canShow: false,
						assignments: [],
						announcements: [],
						quizzes: []
					},
      ]
     })),
					deleteClass: (classIndex) => set((state) => (
							{
								classes: state.classes.filter(((_, i) => i !== classIndex))
							}
					)),
									subAddStudent: (students): Test[] => {
							return [
							...students,
							{
									id: students.length,
								name: "Untitled",
								text: "",
								grade: "",
								assignments: [],
								announcements: [],

							}
						]
				},

				updateCanShowStudents:(classIndex, canShow) => set((state)=>(
						{

												classes: state.classes.map((item, i) =>
					i === classIndex ? { ...item, canShow : canShow} : item)
						}

				)),
				setClassName: (classIndex, className, variableName) =>
    set((state) => ({
        classes: state.classes.map((item, i) =>
            i === classIndex
                ? { ...item, [variableName]: className }
                : item
        )
    })),

				addStudent: (students, classIndex) => set((state) =>
						({
							classes: state.classes.map((item, i) =>
										i === classIndex
												?
							{...item, students : [							...students,
							{
									id: students.length,
								name: "Untitled",
								text: "",
								grade: "",
								assignments: [],
								announcements: [],
								quizzes: [],
							}]}
												: item
								)
						})
		 	),

				// FIX: filter's callback already receives (element, index, array) itself — the
				// extra studentIndex argument here was being passed as filter's thisArg, which
				// does nothing for an arrow function (arrow functions ignore thisArg entirely).
				// Leftover from the old non-API-backed mock; dropped since it had no effect.
				deleteStudent: (classIndex, studentIndex) => set((state) => ({
						classes: state.classes.map((item, i)=>
						i===classIndex ?
					{
						...item, students : item.students.filter((_, j)=> j !== studentIndex)} : item
					)
				})),



    addAssignments: (classIndex, studentIndex, untitledCount) => set((state)=> ({
					classes: 			state.classes.map((item, i) =>
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
													name: "Untitled Assignment" + untitledCount,
													text: "",
													link: "",
													isDone: Math.random() < 0.5 ? false : true,
													grade: 0,
												}
											]
										}
									: student
							)
						}
					: item
			)
				})),

				addClassAssignment:(classIndex, untitledCount) => set((state) => ({
						classes: state.classes.map((item, i) =>
				i === classIndex
					? {
							...item,
							assignments: [
								...item.assignments,
								{
									id: item.assignments.length,
									name: "Untitled Assignment" + untitledCount,
									text: "",
									link: "",
									isDone: false,
									grade: 0
								}
							]
						}
					: item
			),
				})),

	addAssignmentsToStudents: (classIndex, untitledCount) =>
					set((state) => ({
									classes: state.classes.map((item, i) =>
													i === classIndex
																	? {
																					...item,
																					students: item.students.map((student) => ({
																									...student,
																									assignments: [
																													...student.assignments,
																													{
																																	id: student.assignments.length,
																																	name: "Untitled Assignment" + untitledCount,
																																	text: "",
																																	link: "",
																																	isDone: Math.random() < 0.5,
																																	grade: 0
																													}
																									]
																					}))
																	}
																	: item
									)
					})),

					deleteAssignmentToStudents: (classIndex, assignmentName) => set((state) => ({
						classes: state.classes.map((item, i) =>
				i === classIndex
					? {
							...item,
							students: item.students.map((student) => ({
								...student,
								assignments: student.assignments.filter(
									(assignment) => assignment.name !== assignmentName
								)
							}))
						}
					: item
			)
					})),

					addAnnouncementsToStudents: (classIndex, annoucement, textInput) => 					set((state) => ({
									classes: state.classes.map((item, i) =>
													i === classIndex
																	? {
																					...item,
																					students: item.students.map((student) => ({
																									...student,
																									announcements: [
																													...student.announcements,
																													{
																																	id: student.announcements.length,
																																text: textInput,
																																date: "8/4/2067"
																													}
																									]
																					}))
																	}
																	: item
									)
					})),

					addClassAnnouncement: (classIndex, textInput, untitledCount) => set((state) => ({
						classes: state.classes.map((item, i) =>
								i === classIndex
									? {
											...item,
											announcements: [
												...item.announcements,
												{
																id: item.announcements.length,
																text: textInput,
																date: "8/4/2067"
												}
											]
										}
									: item
							),
					})),

					deleteAssignment: (classIndex, studentIndex, assignmentIndex ) => set((state) => ({
						classes: state.classes.map((item, i) =>
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
					})),


					deleteAssignmentClassByName: (classIndex, assignmentName) => set((state)=> ({
							classes: state.classes.map((item, i) =>
				i === classIndex
					? {
							...item,
							assignments: item.assignments.filter(
								(assignment) => assignment.name !== assignmentName
							)
						}
					: item
			)
					})),

					setAssignmentClass: (classIndex, assignmentIndex, assignmentName, assignmentVariableName) => set((state)=>({
						classes: state.classes.map((classItem, i) =>
				i === classIndex
					? {
						...classItem,
						assignments: classItem.assignments.map((assignment, j) =>
							j === assignmentIndex
								? { ...assignment, [assignmentVariableName]: assignmentName }
								: assignment
						)
					}
					: classItem
			)
					})),

					setAssignmentStudent: (classIndex, assignmentIndex, assignmentName, assignmentVariableName: string) => set((state)=>({
							classes: state.classes.map((classItem, i) =>
				i === classIndex
					? {
						...classItem,
						students: classItem.students.map(student => ({
							...student,
							assignments: student.assignments.map((assignment, j) =>
								j === assignmentIndex
									? { ...assignment, [assignmentVariableName]: assignmentName }
									: assignment
							)
						}))
					}
					: classItem
			)
					})),

					setAssignmentIndividualStudent: (classIndex, studentIndex, assignmentIndex, assignmentName, assignmentVariableName) => set((state)=>({
						classes: state.classes.map((classItem, i) =>
				i === classIndex
					? {
							...classItem,
							students: classItem.students.map((student, j) =>
								j === studentIndex
									? {
											...student,
											assignments: student.assignments.map((assignment, k) =>
												k === assignmentIndex
													? {
															...assignment,
															[assignmentVariableName]: assignmentName
														}
													: assignment
											)
										}
									: student
							)
						}
					: classItem
			)
					})),

					setAnnouncementClass: (classIndex, assignmentIndex, assignmentName, assignmentVariableName) => set((state=>({
						classes: state.classes.map((classItem, i) =>
				i === classIndex
					? {
						...classItem,
						announcements: classItem.announcements.map((annoucement, j) =>
							j === assignmentIndex
								? { ...annoucement, [assignmentVariableName]: assignmentName }
								: annoucement
						)
					}
					: classItem
			)
					}))),

					setAnnouncementStudent: (classIndex, assignmentIndex, assignmentName,assignmentVariableName) => set((state)=> ({
					classes: state.classes.map((classItem, i) =>
				i === classIndex
					? {
						...classItem,
						students: classItem.students.map(student => ({
							...student,
							announcements: student.announcements.map((assignment, j) =>
								j === assignmentIndex
									? { ...assignment, [assignmentVariableName]: assignmentName }
									: assignment
							)
						}))
					}
					: classItem
			)
					})),

					setAnnouncementIndividualStudent: (classIndex, studentIndex, assignmentIndex, assignmentName, assignmentVariableName) => set((state) => ({
							classes: state.classes.map((classItem, i) =>
				i === classIndex
					? {
							...classItem,
							students: classItem.students.map((student, j) =>
								j === studentIndex
									? {
											...student,
											announcements: student.announcements.map((assignment, k) =>
												k === assignmentIndex
													? {
															...assignment,
															[assignmentVariableName]: assignmentName
														}
													: assignment
											)
										}
									: student
							)
						}
					: classItem
			)
					})),

					// FIX: `assignmentName += untitledCount` mutated the closure variable itself
					// (not just the field being written), so if more than one assignment in the
					// list matched the duplicate-name check, each later match appended
					// untitledCount onto the already-mutated string from the previous match
					// (e.g. "HW3" -> "HW33" -> "HW333") instead of the original name. Build the
					// new name into its own local instead of reassigning the parameter.
					checkClassAssignmentName: (classIndex, targetAssignmentName, targetindex, assignmentName, untitledCount) =>set((state)=>({
						classes: state.classes.map((classItem, i) =>
				i === classIndex
					? {
						...classItem,
						assignments: classItem.assignments.map((assignment, j) =>
							assignment.name === targetAssignmentName && j !== targetindex
								? { ...assignment, name: `${assignmentName}${untitledCount}` }
								: assignment
						)
					}
					: classItem
			)
					})),

					changeClassBorderColor: (index, color)=>set((state)=>({
						classes: state.classes.map((item, i) => i == index ? {...item, color : color} : item)
					})),

					setCanShowStudents: (index, canShow) => set((state)=> ({
						classes: state.classes.map((item, i) =>
					i === index ? { ...item, canShow : canShow} : item
			)
					})),
					setStudentName: (index, studentIndex, text,variableName) => set((state)=> ({
						classes: state.classes.map((item, i) =>
        i === index
          ?
					{...item, students : item.students.map((student, i) =>
					i === studentIndex
							? { ...student, [variableName] : text }
							: student
			)}
          : item
      )
					}))
}));