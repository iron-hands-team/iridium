"use client";

import type { NotificationType } from "@/types/notification";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { span } from "framer-motion/m";

function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs/60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes/60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours/24);
    if (days<7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}

function Notifications({
    notifications, 
    unreadCount,
}: {
    notifications: NotificationType[];
    unreadCount: number;
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    async function markRead(id: number) {
        await fetch(`/api/notifications/${id}/read`, {
            method: "PATCH",
            credentials: "include",
        });
        router.refresh();
    }

    async function markAllRead() {
        await fetch("/api/notifications/read-all", {
            method: "PATCH",
            credentials: "include",
        });
        router.refresh();
    }

    return (
        <div className="relative">
            <button
                className="px-2 py-1.5 relative"
                onClick={()=>setOpen((o)=>!o)}
                title="Notifications"
            >
                <FaBell size={16}/>
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-xs bg-red-500 text-white rounded-full px-1.5">
                        {unreadCount}
                    </span>
                )}
            </button>
        </div>
    )    
}