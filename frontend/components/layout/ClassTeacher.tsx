"use client";

import { useState, useEffect, useCallback } from "react";
import { FaExclamationTriangle, FaChevronDown, FaChevronRight } from "react-icons/fa";
import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";
import Footer from "@/components/layout/footer";

interface UserSummary {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

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

export default function ClassBody() {
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [roster, setRoster] = useState<Record<number, Enrollment[]>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [newClassName, setNewClassName] = useState("");
  const [studentInputs, setStudentInputs] = useState<Record<number, string>>(
    {},
  );
  const [renaming, setRenaming] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  async function loadRoster(classId: number) {
    try {
      const data: Enrollment[] = await api(`/classes/${classId}/students`);
      setRoster((prev) => ({ ...prev, [classId]: data }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load roster.");
    }
  }

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

  async function addClass() {
    if (!newClassName.trim()) return;
    try {
      setError(null);
      await api("/classes", {
        method: "POST",
        body: JSON.stringify({ name: newClassName.trim() }),
      });
      setNewClassName("");
      await loadClasses();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add class.");
    }
  }

  async function deleteClass(classId: number) {
    try {
      setError(null);
      await api(`/classes/${classId}`, { method: "DELETE" });
      setClasses((prev) => prev.filter((c) => c.id !== classId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete class.");
    }
  }

  async function saveRename(classId: number) {
    const name = renaming[classId]?.trim();
    if (!name) return;
    try {
      setError(null);
      await api(`/classes/${classId}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      setRenaming((prev) => {
        const next = { ...prev };
        delete next[classId];
        return next;
      });
      await loadClasses();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to rename class.");
    }
  }

  async function addStudent(classId: number) {
    const username = studentInputs[classId]?.trim();
    if (!username) return;
    try {
      setError(null);
      await api(`/classes/${classId}/students`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      setStudentInputs((prev) => ({ ...prev, [classId]: "" }));
      await loadRoster(classId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add student.");
    }
  }

  async function removeStudent(classId: number, studentId: number) {
    try {
      setError(null);
      await api(`/classes/${classId}/students/${studentId}`, {
        method: "DELETE",
      });
      setRoster((prev) => ({
        ...prev,
        [classId]: (prev[classId] || []).filter(
          (e) => e.student.id !== studentId,
        ),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove student.");
    }
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
    <div className="bg-[#131313] min-h-screen text-white">
      <header className="flex flex-col gap-y-2 items-center py-8 border-t border-b border-zinc-800">
        <p className="text-xl font-bold">Your Classes</p>
        <p className="text-sm text-zinc-400">
          Manage your class sections and rosters
        </p>
      </header>

      <div className="flex flex-col items-center gap-y-5 p-6">
        <div className="w-2/3 flex gap-x-3">
          <Input
            placeholder="New class name"
            value={newClassName}
            setValue={setNewClassName}
          />
          <Btn text="Add Class" onclick={addClass} primary />
        </div>

        {error && (
          <div className="w-2/3 text-red-500 text-sm flex gap-x-3 items-center">
            <FaExclamationTriangle size={15} /> {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-zinc-400">Loading classes...</p>
        ) : classes.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No classes to show. Create one above!
          </p>
        ) : (
          classes.map((section) => (
            <div
              key={section.id}
              className="w-4/5 p-4 rounded-lg border border-zinc-800 flex flex-col gap-y-3"
            >
              <div className="flex justify-between items-start gap-x-3">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500">#{section.id}</p>
                  {renaming[section.id] !== undefined ? (
                    <div className="flex gap-x-2 mt-1">
                      <Input
                        placeholder="Class name"
                        value={renaming[section.id]}
                        setValue={(v) =>
                          setRenaming((prev) => ({ ...prev, [section.id]: v }))
                        }
                      />
                      <Btn
                        text="Save"
                        onclick={() => saveRename(section.id)}
                        primary
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-bold">{section.name}</p>
                  )}
                  <p className="text-xs text-zinc-500">
                    Teacher: {section.teacher.first_name}{" "}
                    {section.teacher.last_name}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <Btn
                    text={expanded[section.id] ? "Hide" : "Show"}
                    onclick={() => toggleExpanded(section.id)}
                  />
                  <Btn
                    text="Rename"
                    onclick={() =>
                      setRenaming((prev) => ({
                        ...prev,
                        [section.id]: section.name,
                      }))
                    }
                  />
                  <Btn
                    text="Delete Class"
                    onclick={() => deleteClass(section.id)}
                  />
                </div>
              </div>

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
      </div>

      <Footer />
    </div>
  );
}