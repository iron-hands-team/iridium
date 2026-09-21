// components/modals/edit-user-modal.tsx
"use client";

import type { UserType } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import Modal from "../ui/modal";
import Btn from "../ui/btn";
import Input from "../ui/input";
import Dropdown from "../ui/dropdown";

interface EditUserModalProps {
  user: UserType;
  closeModal: () => void;
}

const roles = ["student", "teacher", "admin"];

function EditUserModal({ user, closeModal }: EditUserModalProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [middleName, setMiddleName] = useState(user.middleName || "");
  const [role, setRole] = useState(user.role || "student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          middle_name: middleName || null,
          role,
        }),
      },
    );
    setLoading(false);
    if (res.ok) {
      closeModal();
      router.refresh();
    } else {
      setError("Failed to update user. Please try again.");
    }
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">Edit User</h2>
        <label className="text-sm flex flex-col gap-y-1">
          First Name
          <Input placeholder="" value={firstName} setValue={setFirstName} />
        </label>
        <label className="text-sm flex flex-col gap-y-1">
          Last Name
          <Input placeholder="" value={lastName} setValue={setLastName} />
        </label>
        <label className="text-sm flex flex-col gap-y-1">
          Middle Name
          <Input placeholder="" value={middleName} setValue={setMiddleName} />
        </label>
        <div className="flex items-center gap-x-3 text-sm">
          Role
          <Dropdown value={role} setValue={setRole} values={roles} />
        </div>
        {error && (
          <div className="text-red-500 text-sm flex gap-x-3 items-center">
            <FaExclamationTriangle size={15} /> {error}
          </div>
        )}
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Saving..." : "Save"}
            onclick={handleSubmit}
            styles="text-sm w-fit!"
            primary
          />
          <Btn text="Cancel" onclick={closeModal} styles="text-sm w-fit!" />
        </div>
      </div>
    </Modal>
  );
}

export default EditUserModal;
