"use client";

import type { EventType } from "@/types/event";
import type { UserType } from "@/types/user";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import EventCard from "./event-card";
import NewEventModal from "../modals/new-event";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

interface CalendarGridProps {
  events: EventType[];
  user: UserType;
}

function CalendarGrid({ events, user }: CalendarGridProps) {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  const [addingOn, setAddingOn] = useState<Date | null>(null);
  const isStaff = user.role === "teacher" || user.role === "admin";

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(now);
    setMounted(true);
  }, []);

  if (!mounted || !today || !viewDate || !selected) {
    return (
      <div className="flex gap-x-10">
        <div className="flex-1 text-sm text-zinc-500">Loading calendar...</div>
      </div>
    );
  }

  const eventsByDay = new Map<string, EventType[]>();
  for (const event of events) {
    const key = dateKey(new Date(event.start_time));
    const list = eventsByDay.get(key) || [];
    list.push(event);
    eventsByDay.set(key, list);
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  function goToMonth(delta: number) {
    setViewDate(new Date(year, month + delta, 1));
  }

  const selectedEvents = (eventsByDay.get(dateKey(selected)) || []).sort(
    (a, b) => a.start_time.localeCompare(b.start_time),
  );

  return (
    <div className="flex gap-x-10">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">
            {viewDate.toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex gap-x-2">
            <div
              onClick={() => goToMonth(-1)}
              className="p-2 border border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
              title="Previous month"
            >
              <FaChevronLeft size={12} />
            </div>
            <div
              onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="px-3 py-2 border border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer text-xs"
            >
              Today
            </div>
            <div
              onClick={() => goToMonth(1)}
              className="p-2 border border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
              title="Next month"
            >
              <FaChevronRight size={12} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l border-zinc-800">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="text-xs text-center text-zinc-500 py-2 border-r border-b border-zinc-800"
            >
              {w}
            </div>
          ))}
          {cells.map((cellDate, i) => {
            if (!cellDate) {
              return (
                <div
                  key={i}
                  className="h-24 border-r border-b border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/50"
                />
              );
            }
            const dayEvents = eventsByDay.get(dateKey(cellDate)) || [];
            const isToday = dateKey(cellDate) === dateKey(today);
            const isSelected = dateKey(cellDate) === dateKey(selected);
            return (
              <div
                key={i}
                onClick={() => setSelected(cellDate)}
                className={`h-24 border-r border-b border-zinc-800 p-1.5 cursor-pointer flex flex-col gap-y-1 overflow-hidden hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 ${isSelected ? "bg-zinc-200 dark:bg-zinc-900" : ""}`}
              >
                <div
                  className={`text-xs w-5 h-5 flex items-center justify-center ${isToday ? "bg-zinc-950 dark:bg-zinc-300 text-zinc-300 dark:text-zinc-950 rounded-full" : ""}`}
                >
                  {cellDate.getDate()}
                </div>
                <div className="flex flex-col gap-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className="text-xs truncate px-1 bg-zinc-200 dark:bg-zinc-900 border-l-2 border-zinc-500"
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-zinc-500 px-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-90 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">
            {selected.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          {isStaff && (
            <button
              onClick={() => setAddingOn(selected)}
              className="text-xs text-zinc-500 hover:underline cursor-pointer"
            >
              + Add event
            </button>
          )}
        </div>
        <div className="flex flex-col gap-y-3">
          {selectedEvents.length === 0 ? (
            <div className="text-sm text-zinc-500">
              No events on this day.
            </div>
          ) : (
            selectedEvents.map((event) => (
              <EventCard key={event.id} event={event} user={user} />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {addingOn && (
          <NewEventModal
            defaultDate={addingOn}
            closeModal={() => setAddingOn(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CalendarGrid;