"use client";

import type { EventType } from "@/types/event";
import type { UserType } from "@/types/user";
import { FaMapMarkerAlt, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Menu from "../ui/menu";
import WarningModal from "../modals/warning";
import NewEventModal from "../modals/new-event";

interface EventCardProps {
  event: EventType;
  user: UserType;
}

function formatRange(start: string, end?: string) {
  const startDate = new Date(start);
  const startStr = startDate.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  if (!end) return startStr;
  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();
  const endStr = sameDay
    ? endDate.toLocaleString(undefined, { hour: "numeric", minute: "2-digit" })
    : endDate.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
  return `${startStr} - ${endStr}`;
}

function EventCard({ event, user }: EventCardProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const router = useRouter();
  const attending = event.attendees.includes(user.username);
  const isStaff = user.role === "teacher" || user.role === "admin";

  async function handleRsvp() {
    setRsvpLoading(true);
    await fetch(`/api/events/${event.id}/rsvp`, {
      method: attending ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    router.refresh();
    setRsvpLoading(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/events/${event.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    router.refresh();
    setDeleting(null);
  }

  return (
    <div className="border-1 border-zinc-800 p-4 flex flex-col gap-y-2 relative">
      <div className="flex justify-between items-start gap-x-4">
        <div>
          <h3 className="text-lg font-bold">{event.title}</h3>
          <div className="text-xs text-zinc-500">
            {formatRange(event.start_time, event.end_time)}
          </div>
          {event.location && (
            <div className="text-xs text-zinc-500 flex items-center gap-x-1 mt-1">
              <FaMapMarkerAlt size={11} /> {event.location}
            </div>
          )}
        </div>
        {isStaff && (
          <Menu
            options={[
              { name: "Edit", onclick: () => setEditing(true) },
              {
                name: "Delete",
                onclick: () => setDeleting(false),
                warning: true,
              },
            ]}
          />
        )}
      </div>
      {event.description && (
        <p className="text-sm text-black! dark:text-zinc-300!">
          {event.description}
        </p>
      )}
      <div
        className="text-sm flex items-center gap-x-2 cursor-pointer text-zinc-700 dark:text-zinc-300 w-fit group"
        onClick={rsvpLoading ? undefined : handleRsvp}
        title={attending ? "Cancel RSVP" : "RSVP to this event"}
      >
        <div className="group-hover:scale-110 transition-transform!">
          {attending ? (
            <FaCheckCircle size={14} className="text-green-500" />
          ) : (
            <FaRegCircle size={14} />
          )}
        </div>
        {attending ? "You're going" : "RSVP"}
        {event.attendees.length > 0 && (
          <span className="text-zinc-500">
            &middot; {event.attendees.length} going
          </span>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <NewEventModal existing={event} closeModal={() => setEditing(false)} />
        )}
        {deleting !== null && (
          <WarningModal
            title="Delete event confirmation"
            description={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default EventCard;