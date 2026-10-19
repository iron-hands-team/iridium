"use client";

import type { NotificationType } from "@/types/notification";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBell } from "react-icons/fa";

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
            {open && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={()=>setOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto border border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg z-20 flex flex-col">
                        <div className="flex justify-between items-center p-3 border-b border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950">
                            <span className="font-bold text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <button
                                    className="text-xs text-zinc-500 hover:text-black dark:hover:text-zinc-300"
                                    onClick={markAllRead}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-zinc-500 text-center">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((n)=>(
                                <Link
                                    key={n.id}
                                    href={n.link || "#"}
                                    onClick={()=>{
                                        setOpen(false);
                                        if (!n.read) markRead(n.id);
                                    }}
                                    className={`p-3 border-b border-zinc-800 text-sm flex flex-col gap-y-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                                        !n.read ? "font-bold" : ""
                                    }`}
                                >
                                    <span>{n.title}</span>
                                    {n.body && (
                                        <span className="text-xs text-zinc-500 font-normal">
                                            {n.body}
                                        </span>
                                    )}
                                    <span className="text-xs text-zinc-500 font-normal">
                                        {timeAgo(n.createdAt)}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Notifications;