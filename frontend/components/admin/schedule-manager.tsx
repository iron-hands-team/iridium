"use client";
 
import { useState } from "react";
import { FaExclamationTriangle, FaSearch, FaTrash } from "react-icons/fa";
import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";
 
interface FoundUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}
 
interface ScheduleItem {
  id: number;
  period: number;
  course_name: string;
  room: string | null;
  start_time: string | null;
  end_time: string | null;
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
 
function formatTime(t: string | null) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
 
export default function ScheduleManager() {
  const [usernameSearch, setUsernameSearch] = useState("");
  const [student, setStudent] = useState<FoundUser | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
 
  const [period, setPeriod] = useState("");
  const [courseName, setCourseName] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
 
  async function searchStudent() {
    const username = usernameSearch.trim();
    if (!username) return;
    setSearching(true);
    setError(null);
    setStudent(null);
    setSchedule([]);
    try {
      const user: FoundUser = await api(`/users/${username}`);
      setStudent(user);
      await loadSchedule(user.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't find that user.");
    } finally {
      setSearching(false);
    }
  }
 
  async function loadSchedule(userId: number) {
    setLoadingSchedule(true);
    try {
      const data: ScheduleItem[] = await api(`/schedule/${userId}`);
      setSchedule(data.sort((a, b) => a.period - b.period));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load schedule.");
    } finally {
      setLoadingSchedule(false);
    }
  }
 
  async function addItem() {
    if (!student) return;
    const periodNum = Number(period);
    if (!courseName.trim() || Number.isNaN(periodNum) || periodNum <= 0) {
      setError("Enter a valid period and course name.");
      return;
    }
    try {
      setError(null);
      await api("/schedule", {
        method: "POST",
        body: JSON.stringify({
          user_id: student.id,
          period: periodNum,
          course_name: courseName.trim(),
          room: room.trim() || null,
          start_time: startTime || null,
          end_time: endTime || null,
        }),
      });
      setPeriod("");
      setCourseName("");
      setRoom("");
      setStartTime("");
      setEndTime("");
      await loadSchedule(student.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to add schedule item.");
    }
  }

  async function deleteItem(itemId: number) {
    try {
        setError(null);
        await api(`/schedule/${itemId}`, { method: "DELETE" });
        setSchedule((prev) => prev.filter((item) => item.id !== itemId));
    } catch (e) {
        setError(
            e instanceof Error ? e.message : "Failed to delete schedule item.",
        );
    }
  }


  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-3">
        <Input
          placeholder="Student or teacher username"
          value={usernameSearch}
          setValue={setUsernameSearch}
        />
        <Btn
          text={searching ? "Searching..." : "Find"}
          onclick={searchStudent}
          primary
        />
      </div>
 
      {error && (
        <div className="text-red-500 text-sm flex gap-x-3 items-center">
          <FaExclamationTriangle size={15} /> {error}
        </div>
      )}
 
      {student && (
        <div className="border-1 border-zinc-800 p-4 flex flex-col gap-y-4">
          <div className="flex items-center gap-x-3 text-sm">
            <FaSearch size={13} className="text-zinc-500" />
            <span className="font-bold">
              {student.first_name} {student.last_name}
            </span>
            <span className="text-zinc-500">@{student.username}</span>
          </div>
 
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            <Input
              placeholder="Period"
              type="number"
              value={period}
              setValue={setPeriod}
              styles="w-24!"
            />
            <Input
              placeholder="Course name"
              value={courseName}
              setValue={setCourseName}
              styles="flex-1"
            />
            <Input
              placeholder="Room (optional)"
              value={room}
              setValue={setRoom}
              styles="w-32!"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border-1 border-zinc-800 px-3 bg-transparent text-sm"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border-1 border-zinc-800 px-3 bg-transparent text-sm"
            />
            <Btn text="Add period" onclick={addItem} primary />
          </div>
 
          {loadingSchedule ? (
            <p className="text-sm text-zinc-500">Loading schedule...</p>
          ) : schedule.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No schedule items yet. Add one above.
            </p>
          ) : (
            <div className="flex flex-col">
              {schedule.map((item) => {
                const start = formatTime(item.start_time);
                const end = formatTime(item.end_time);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-x-4 border-b border-zinc-800 py-2 text-sm"
                  >
                    <div className="w-20 text-zinc-500">
                      Period {item.period}
                    </div>
                    <div className="flex-1 font-bold">
                      {item.course_name}
                    </div>
                    <div className="text-zinc-500">
                      {item.room && <>{item.room} &middot; </>}
                      {start && end
                        ? `${start} - ${end}`
                        : start || end || ""}
                    </div>
                    <div
                      className="text-red-500 cursor-pointer hover:underline flex items-center gap-x-1"
                      onClick={() => deleteItem(item.id)}
                    >
                      <FaTrash size={12} /> Remove
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}