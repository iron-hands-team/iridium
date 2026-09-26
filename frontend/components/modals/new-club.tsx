"use client";

import type { ClubCategory, ClubType } from "@/types/clubs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import { categories } from "@/lib/constants";
import { newClubSchema, NewClubType } from "@/lib/schemas";
import Modal from "../ui/modal";
import Btn from "../ui/btn";
import Input from "../ui/input";
import Dropdown from "../ui/dropdown";

const displayCategories = categories.map(
  (c) => c[0].toUpperCase() + c.slice(1),
);
const labelStyles = "text-sm flex flex-col gap-y-1";

interface NewClubModalProps {
  closeModal: () => void;
  existing?: ClubType;
}

function NewClubModal({ closeModal, existing }: NewClubModalProps) {
  const [club, setClub] = useState<NewClubType>(
    existing
      ? { ...existing }
      : {
          name: "",
          categories: [],
        },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    let res;
    const validated = newClubSchema.safeParse(club);
    if (validated.success) {
      if (existing) {
        res = await fetch("/api/clubs", {
          method: "PATCH", //patch endpoint doesn't work yet
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(club),
        });
      } else {
        res = await fetch("/api/clubs", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: club.name,
            description: club.description,
            sponsor_id: club.sponsorId, //TODO: add club categories
          }),
        });
      }
      if (res.ok) {
        closeModal();
        router.refresh();
      } else {
        setError(
          `Failed to ${existing ? "update" : "add"} club. Please try again.`,
        );
      }
    } else {
      setError(validated.error.issues[0].message);
    }
    setLoading(false);
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">{existing ? "Edit" : "Add"} club</h2>
        <label className={labelStyles}>
          <div>
            Name <span className="text-red-500">*</span>
          </div>
          <Input
            value={club.name}
            setValue={(name) => setClub({ ...club, name })}
          />
        </label>
        <label className={labelStyles}>
          <div>Description</div>
          <Input
            value={club.description || ""}
            setValue={(description) => setClub({ ...club, description })}
          />
        </label>
        <label className={labelStyles}>
          <div>
            Sponsor ID <span className="text-red-500">*</span>
          </div>
          <Input
            value={club.sponsorId + "" || ""}
            setValue={(s) => setClub({ ...club, sponsorId: Number(s) })}
          />
        </label>
        <div className={labelStyles}>
          <div>
            Categories <span className="text-red-500">*</span>
          </div>
          <Dropdown
            value={club.categories.length > 0 ? club.categories.join(", ") : ""}
            setValue={(category) =>
              setClub({
                ...club,
                categories: [
                  ...club.categories,
                  category.toLowerCase() as ClubCategory,
                ],
              })
            }
            values={displayCategories}
            above
          />
        </div>
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

export default NewClubModal;
