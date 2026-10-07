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
    const res = await fetch('/api${path}', {
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        ... init,
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
    return '${hour12}:${String(m).padStart(2,"0")} ${period}';
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

    async function searchStudent() {
        const username = usernameSearch.trim();
        if (!username) return;
        setSearching(true);
        setError(null);
        setStudent(null);
        setSchedule([]);
        try {
            const user: FoundUser = await api('/users/${username}');
            setStudent(user);
            await loadSchedule(user.id);
        } catch (e) {
            setError (e instanceof Error ? e.message : "Couldnt find that user.");
        } finally {
            setSearching(false);
        }
    }

    async function loadSchedule(userId: number) {
        setLoadingSchedule(true);
        try {
            const data: ScheduleItem[] = await api('/schedule/${userId}');
            setSchedule(data.sort((a,b) => a.period - b.period));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load schedule.");
        } finally {
            setLoadingSchedule(false);
        }
    }
}

async function addItem() {
    if (!student) return;
    const periodNum = Number(period);
    if 
}