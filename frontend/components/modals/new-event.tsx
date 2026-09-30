"use client";

import type { EventType } from "@/types/event";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import { newEventSchema, type NewEventType } from "@/lib/schemas";
import Modal from "../ui/modal";
import Btn from "../ui/btn";
import Input from "../ui/input";
import Textarea from "../ui/textarea";

const labelStyles = "text-sm flex flex-col gap-y-1";

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface NewEventModalProps {
  closeModal: () => void;
  existing?: EventType;
  defaultDate?: Date;
}

function NewEventModal({ closeModal, existing, defaultDate }: NewEventModalProps) {
  const [event, setEvent] = useState<NewEventType>(
    existing
      ? {
          id: existing.id,
          title: existing.title,
          description: existing.description || "",
          location: existing.location || "",
          start_time: toLocalInputValue(existing.start_time),
          end_time: toLocalInputValue(existing.end_time),
        }
      : {
          title: "",
          description: "",
          location: "",
          start_time: toLocalInputValue(defaultDate?.toISOString()),
          end_time: "",
        },
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setError(null);
    const validated = newEventSchema.safeParse(event);
    if (!validated.success) {
      setError(validated.error.issues[0].message);
      return;
    }
    setLoading(true);

    const body = {
      title: event.title,
      description: event.description || null,
      location: event.location || null,
      start_time: new Date(event.start_time).toISOString(),
      end_time: event.end_time ? new Date(event.end_time).toISOString() : null,
    };

    const res = existing
      ? await fetch(`/api/events/${existing.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/events", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    setLoading(false);
    if (res.ok) {
      router.refresh();
      closeModal();
    } else {
      setError(
        `Failed to ${existing ? "update" : "add"} event. Please try again.`,
      );
    }
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">
          {existing ? "Edit" : "New"} event
        </h2>
        <label className={labelStyles}>
          <div>
            Title <span className="text-red-500">*</span>
          </div>
          <Input
            placeholder="Fall Pep Rally"
            value={event.title}
            setValue={(title) => setEvent({ ...event, title })}
          />
        </label>
        <label className={labelStyles}>
          <div>Description</div>
          <Textarea
            placeholder="What's happening, and who should come?"
            value={event.description || ""}
            setValue={(description) => setEvent({ ...event, description })}
          />
        </label>
        <label className={labelStyles}>
          <div>Location</div>
          <Input
            placeholder="Main Gym"
            value={event.location || ""}
            setValue={(location) => setEvent({ ...event, location })}
          />
        </label>
        <label className={labelStyles}>
          <div>
            Starts <span className="text-red-500">*</span>
          </div>
          <Input
            type="datetime-local"
            value={event.start_time}
            setValue={(start_time) => setEvent({ ...event, start_time })}
          />
        </label>
        <label className={labelStyles}>
          <div>Ends</div>
          <Input
            type="datetime-local"
            value={event.end_time || ""}
            setValue={(end_time) => setEvent({ ...event, end_time })}
          />
        </label>
        {error && (
          <div className="text-red-500 text-sm flex gap-x-3 items-center">
            <FaExclamationTriangle size={15} /> {error}
          </div>
        )}
        <div className="flex gap-x-3">
          <Btn
            text={
              existing
                ? loading
                  ? "Saving..."
                  : "Save"
                : loading
                  ? "Adding..."
                  : "Add"
            }
            onclick={handleSubmit}
            styles="text-sm"
            primary
          />
          <Btn text="Cancel" onclick={closeModal} styles="text-sm" />
        </div>
      </div>
    </Modal>
  );
}

export default NewEventModal;