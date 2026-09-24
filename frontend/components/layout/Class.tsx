"use client";

import { useState, useEffect, useCallback } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
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