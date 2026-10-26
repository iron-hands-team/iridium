"use client";

import type { ChannelType as ChannelT } from "@/lib/schemas";
import type { ClubResponse } from "@/types/clubs";
import { useState, useEffect } from "react";
import { channelSchema } from "@/lib/schemas";
import { FaExclamationTriangle } from "react-icons/fa";
import { roles } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import Dropdown from "../ui/dropdown";
import Btn from "../ui/btn";

const labelStyles = "text-sm flex flex-col gap-y-1";

interface ClubType {
  id: number;
  name: string;
}

type ChannelType = Omit<ChannelT, "club"> & {
  club?: ClubType;
};

interface NewChannelProps {
  closeModal: () => void;
  existing?: ChannelType;
  toast: (msg: string) => void;
}

function NewChannelModal({ closeModal, existing, toast }: NewChannelProps) {
  const [channel, setChannel] = useState<ChannelType>({
    name: "",
    role: "all",
  });
  const [clubs, setClubs] = useState<ClubType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    const validated = channelSchema.safeParse({
      ...channel,
      club: channel.club?.id,
    });
    if (validated.success) {
      setError(null);
      const res = await fetch(`/api/chat/channels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated.data),
      });
      const channel = await res.json();
      if (res.ok) {
        router.refresh();
        router.push(`/chat/${channel.id}`);
        toast(`Channel ${existing ? "updated" : "created"} successfully!`);
        closeModal();
      } else {
        setError(
          res.status === 403
            ? channel.detail
            : "Something went wrong, please try again.",
        );
      }
    } else {
      setError(validated.error.issues[0].message);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchClubs() {
      const fetchedClubs: ClubResponse[] = await fetch(`/api/clubs`).then(
        (res) => res.json(),
      );
      const clubData = fetchedClubs.map((c) => {
        return { id: c.id, name: c.name };
      });
      setClubs(clubData);
    }
    fetchClubs();
  }, []);

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">
          {existing ? "Edit" : "Create"} channel
        </h2>
        <label className={labelStyles}>
          <div>
            Name <span className="text-red-500">*</span>
          </div>
          <Input
            placeholder="hack-club"
            value={channel.name}
            setValue={(n) =>
              setChannel({
                ...channel,
                name: n.toLowerCase().replaceAll(" ", "-"),
              })
            }
          />
        </label>
        <label className={labelStyles}>
          Description
          <Textarea
            placeholder="The most interesting club in your school!"
            value={channel.description || ""}
            setValue={(description) => setChannel({ ...channel, description })}
          />
        </label>
        <label className={labelStyles}>
          <div>
            Role <span className="text-red-500">*</span>
          </div>
          <Dropdown
            value={
              channel.role
                ? channel.role[0].toUpperCase() + channel.role.slice(1)
                : ""
            }
            setValue={(r) => setChannel({ ...channel, role: r.toLowerCase() })}
            values={[
              "All",
              ...roles.map((r) => r[0].toUpperCase() + r.slice(1)),
            ]}
          />
        </label>
        <label className={labelStyles}>
          Club
          <Dropdown
            value={channel.club?.name || ""}
            setValue={(club) =>
              setChannel({
                ...channel,
                club:
                  club === "None"
                    ? undefined
                    : clubs.find((c) => c.name === club),
              })
            }
            values={["None", ...clubs.map((c) => c.name)]}
            label="Select a club"
            above
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
                  ? "Saving"
                  : "Save"
                : loading
                  ? "Creating..."
                  : "Create"
            }
            onclick={handleCreate}
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}

export default NewChannelModal;
