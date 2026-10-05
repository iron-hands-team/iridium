"use client";

<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { FaExclamationTriangle, FaChevronDown, FaChevronRight } from "react-icons/fa";
=======
import { useState } from "react";
>>>>>>> 67ab82ca1a53cde6641ccb631e8d7c140a6c7e04
import Btn from "@/components/ui/btn";
import "@/app/globals.css";
import Footer from "@/components/layout/footer";
import { a, i } from "framer-motion/client";
import Header from "@/components/layout/header";
import { cs } from "@/lib/classStore";
import AssignmentsPopupClassTeacher from "@/components/layout/assignmentsPopupClassTeacher";
import MessagesPopupClassTeacher from "@/components/layout/messagesPopupClassTeacher";
import SettingsPopupClassTeacher from "@/components/layout/settingsPopupClassTeacher";
import StudentsPopupClassTeacher from "@/components/layout/studentsPopupClassTeacher";
import BodyClassTeacher from "@/components/layout/BodyClassTeacher";

// imports are correct i think

<<<<<<< HEAD
interface Enrollment {
  id: number;
  student: UserSummary;
}

interface ClassSection {
  id: number;
  name: string;
  teacher: UserSummary;
}

interface Grade {
  id: number;
  student: UserSummary;
  score: number | null;
}

interface Assignment {
  id: number;
  name: string;
  max_score: number;
  class_id: number;
  grades: Grade[];
}

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Something went wrong. Please try again.");
  }
  return res.status === 204 ? null : res.json();
}
=======
>>>>>>> 67ab82ca1a53cde6641ccb631e8d7c140a6c7e04

export default function ClassBody() {
  const [asd, setAsd] = useState("");

<<<<<<< HEAD
  const [assignments, setAssignments] = useState<Record<number, Assignment[]>>(
    {},
  );
  const [openAssignment, setOpenAssignment] = useState<Record<number, boolean>>(
    {},
  );
  const [addingAssignment, setAddingAssignment] = useState<
    Record<number, boolean>
  >({});
  const [newAssignmentName, setNewAssignmentName] = useState<
    Record<number, string>
  >({});
  const [newAssignmentMax, setNewAssignmentMax] = useState<
    Record<number, string>
  >({});
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, string>>({});

  const loadClasses = useCallback(async () => {
    try {
      setError(null);
      const data: ClassSection[] = await api("/classes");
      setClasses(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  }, []);
=======
>>>>>>> 67ab82ca1a53cde6641ccb631e8d7c140a6c7e04

	

	const borderColors: Record<string, string> = {
			blue: "border-blue-500",
			red: "border-red-500",
			green: "border-green-500",
			yellow: "border-yellow-500",
			purple: "border-purple-500",
			gray: "border-zinc-500",
	};

<<<<<<< HEAD
  function toggleExpanded(classId: number) {
    const next = !expanded[classId];
    setExpanded((prev) => ({ ...prev, [classId]: next }));
    if (next && !roster[classId]) {
      loadRoster(classId);
    }
    if (next && !assignments[classId]) {
      loadAssignments(classId);
    }
  }
=======
	const buttonColors: Record<string, string> = {
		blue: "bg-blue-600",
		red: "bg-red-800",
		green: "bg-green-800",
		yellow: "bg-yellow-600",
		purple: "bg-purple-800",
		gray: "bg-zinc-800",
	};
	const settingsPopup = cs((state)=>state.settingsPopup);
	const setSettingsPopup = cs((state)=>state.setSettingsPopup);
	const settingsClassIndex = cs((state)=> state.settingsClassIndex);
	
	const setSettingsClassIndex = cs((state)=> state.setSettingsClassIndex);
	const studentsPopup = cs((state)=>state.studentsPopup);
	const setStudentsPopup = cs((state)=>state.setStudentsPopup);
	const setSettingsStudentsIndex= cs((state)=>state.setSettingsStudentsIndex);
>>>>>>> 67ab82ca1a53cde6641ccb631e8d7c140a6c7e04

	const assignmentsPopup = cs((state)=>state.assignmentsPopup);
	const setAssignmentsPopup = cs((state)=>state.setAssignmentsPopup);
	const messagePopup = cs((state)=>state.messagePopup);
	const setMessagePopup = cs((state)=>state.setMessagePopup);


	const classes = cs((state) => state.classes);
	const addClass = cs((state) => state.addClass);
	const addStudent = cs((state) => state.addStudent);
	const setClassName = cs((state)=> state.setClassName);

	const setStudentname = cs((state) => state.setStudentName);


	const updateCanShowStudents = cs((state)=>state.updateCanShowStudents);

	function nothing() {

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

  async function loadAssignments(classId: number) {
    try {
      const data: Assignment[] = await api(`/classes/${classId}/assignments`);
      setAssignments((prev) => ({ ...prev, [classId]: data }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load gradebook.");
    }
  }

  async function addAssignment(classId: number) {
    const name = newAssignmentName[classId]?.trim();
    const maxRaw = newAssignmentMax[classId]?.trim();
    const max_score = maxRaw ? Number(maxRaw) : 100;
    if (!name || Number.isNaN(max_score) || max_score <= 0) return;
    try {
      setError(null);
      await api(`/classes/${classId}/assignments`, {
        method: "POST",
        body: JSON.stringify({ name, max_score }),
      });
      setNewAssignmentName((prev) => ({ ...prev, [classId]: "" }));
      setNewAssignmentMax((prev) => ({ ...prev, [classId]: "" }));
      setAddingAssignment((prev) => ({ ...prev, [classId]: false }));
      await loadAssignments(classId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add assignment.");
    }
  }

  async function deleteAssignment(classId: number, assignmentId: number) {
    try {
      setError(null);
      await api(`/assignments/${assignmentId}`, { method: "DELETE" });
      setAssignments((prev) => ({
        ...prev,
        [classId]: (prev[classId] || []).filter((a) => a.id !== assignmentId),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete assignment.");
    }
  }

  async function saveScore(
    classId: number,
    assignmentId: number,
    studentId: number,
  ) {
    const key = `${assignmentId}:${studentId}`;
    const raw = scoreDrafts[key];
    const score = raw === undefined || raw === "" ? null : Number(raw);
    if (score !== null && Number.isNaN(score)) return;
    try {
      setError(null);
      await api(`/assignments/${assignmentId}/grades/${studentId}`, {
        method: "PATCH",
        body: JSON.stringify({ score }),
      });
      setAssignments((prev) => ({
        ...prev,
        [classId]: (prev[classId] || []).map((a) =>
          a.id !== assignmentId
            ? a
            : {
                ...a,
                grades: a.grades.map((g) =>
                  g.student.id === studentId ? { ...g, score } : g,
                ),
              },
        ),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save score.");
    }
  }

  function toggleAssignment(classId: number, assignmentId: number) {
    setOpenAssignment((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
    if (!assignments[classId]) loadAssignments(classId);
  }

  return (
		
    <div className="bg-[#131313]">

			{settingsPopup && settingsClassIndex != -1 &&(<SettingsPopupClassTeacher/>)}
			{studentsPopup && (<StudentsPopupClassTeacher/>)}

			{ assignmentsPopup &&( <AssignmentsPopupClassTeacher/>)}

			{ messagePopup && (<MessagesPopupClassTeacher/>)}

<<<<<<< HEAD
              {expanded[section.id] && (
                <div className="flex flex-col gap-y-3 mt-2">
                  <p className="font-bold text-sm">Students</p>
                  <div className="flex gap-x-2">
                    <Input
                      placeholder="Student username"
                      value={studentInputs[section.id] || ""}
                      setValue={(v) =>
                        setStudentInputs((prev) => ({
                          ...prev,
                          [section.id]: v,
                        }))
                      }
                    />
                    <Btn
                      text="Add Student"
                      onclick={() => addStudent(section.id)}
                    />
                  </div>
                  {(roster[section.id] || []).length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      No students in this class currently.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-y-2">
                      {roster[section.id].map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex justify-between items-center border-b border-zinc-800 pb-1"
                        >
                          <p className="text-sm">
                            {enrollment.student.first_name}{" "}
                            {enrollment.student.last_name}{" "}
                            <span className="text-zinc-500">
                              @{enrollment.student.username}
                            </span>
                          </p>
                          <Btn
                            text="Remove"
                            styles="text-xs"
                            onclick={() =>
                              removeStudent(section.id, enrollment.student.id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <p className="font-bold text-sm">Gradebook</p>
                    <Btn
                      text={addingAssignment[section.id] ? "Cancel" : "+ Assignment"}
                      styles="text-xs"
                      onclick={() =>
                        setAddingAssignment((prev) => ({
                          ...prev,
                          [section.id]: !prev[section.id],
                        }))
                      }
                    />
                  </div>

                  {addingAssignment[section.id] && (
                    <div className="flex gap-x-2">
                      <Input
                        placeholder="Assignment name"
                        value={newAssignmentName[section.id] || ""}
                        setValue={(v) =>
                          setNewAssignmentName((prev) => ({
                            ...prev,
                            [section.id]: v,
                          }))
                        }
                      />
                      <Input
                        placeholder="Max score (100)"
                        type="number"
                        value={newAssignmentMax[section.id] || ""}
                        setValue={(v) =>
                          setNewAssignmentMax((prev) => ({
                            ...prev,
                            [section.id]: v,
                          }))
                        }
                      />
                      <Btn
                        text="Add"
                        onclick={() => addAssignment(section.id)}
                        primary
                      />
                    </div>
                  )}

                  {(assignments[section.id] || []).length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      No assignments yet.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-y-2">
                      {assignments[section.id].map((assignment) => {
                        const isOpen = !!openAssignment[assignment.id];
                        const graded = assignment.grades.filter(
                          (g) => g.score !== null,
                        );
                        const avg =
                          graded.length > 0
                            ? (
                                graded.reduce(
                                  (sum, g) => sum + (g.score || 0),
                                  0,
                                ) / graded.length
                              ).toFixed(1)
                            : null;
                        return (
                          <div
                            key={assignment.id}
                            className="border border-zinc-800 rounded-md"
                          >
                            <div
                              className="flex justify-between items-center p-2 cursor-pointer"
                              onClick={() =>
                                toggleAssignment(section.id, assignment.id)
                              }
                            >
                              <div className="flex items-center gap-x-2 text-sm">
                                {isOpen ? (
                                  <FaChevronDown size={10} />
                                ) : (
                                  <FaChevronRight size={10} />
                                )}
                                <span className="font-bold">
                                  {assignment.name}
                                </span>
                                <span className="text-zinc-500">
                                  /{assignment.max_score}
                                </span>
                                {avg && (
                                  <span className="text-zinc-500">
                                    &middot; avg {avg}
                                  </span>
                                )}
                              </div>
                              <Btn
                                text="Delete"
                                styles="text-xs"
                                onclick={(e?: React.MouseEvent) => {
                                  e?.stopPropagation();
                                  deleteAssignment(section.id, assignment.id);
                                }}
                              />
                            </div>
                            {isOpen && (
                              <div className="flex flex-col gap-y-1 p-2 pt-0">
                                {assignment.grades.map((grade) => {
                                  const key = `${assignment.id}:${grade.student.id}`;
                                  return (
                                    <div
                                      key={grade.id}
                                      className="flex justify-between items-center text-sm"
                                    >
                                      <span>
                                        {grade.student.first_name}{" "}
                                        {grade.student.last_name}
                                      </span>
                                      <div className="flex items-center gap-x-1">
                                        <input
                                          type="number"
                                          className="w-16 bg-transparent border-b border-zinc-700 text-right text-sm focus:outline-none"
                                          placeholder="-"
                                          defaultValue={grade.score ?? ""}
                                          onChange={(e) =>
                                            setScoreDrafts((prev) => ({
                                              ...prev,
                                              [key]: e.target.value,
                                            }))
                                          }
                                          onBlur={() =>
                                            saveScore(
                                              section.id,
                                              assignment.id,
                                              grade.student.id,
                                            )
                                          }
                                        />
                                        <span className="text-zinc-500">
                                          /{assignment.max_score}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
=======

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
									setClassName(i, e.target.value, "className")
								}}
							></textarea>
							<div className="w-[100px] flex align-middle">
								<Btn onclick={() => functionSetSettings(classes[i].id)} text="Settings"/>
							</div>
						</div>
						<br></br>
      <div className="w-2/3 flex">
      	<Btn text="Manage Announcement 📢" onclick={() => functionSetMessage(i)}/>
      	<Btn text="Manage Assignments" onclick={() => functionSetAssignment(i)}/>
>>>>>>> 67ab82ca1a53cde6641ccb631e8d7c140a6c7e04
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
<<<<<<< HEAD
}
=======
}

>>>>>>> 67ab82ca1a53cde6641ccb631e8d7c140a6c7e04
