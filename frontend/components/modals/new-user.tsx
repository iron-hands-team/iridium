"use client";

import type { RoleType, UserType } from "@/types/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import { roles } from "@/lib/constants";
import { newUserSchema, NewUserType } from "@/lib/schemas";
import Modal from "../ui/modal";
import Btn from "../ui/btn";
import Input from "../ui/input";
import Dropdown from "../ui/dropdown";

const displayRoles = roles.map((r) => r[0].toUpperCase() + r.slice(1));
const labelStyles = "text-sm flex flex-col gap-y-1";

interface NewUserModalProps {
  closeModal: () => void;
  existing?: UserType;
}

function NewUserModal({ closeModal, existing }: NewUserModalProps) {
  const [user, setUser] = useState<NewUserType>(
    existing
      ? { ...existing, password: "secretpassword123" }
      : {
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          role: roles[0],
        },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    let res;
    const validated = newUserSchema.safeParse(user);
    if (validated.success) {
      if (existing) {
        res = await fetch(`/api/users/${user.username}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: user.firstName,
            last_name: user.lastName,
            middle_name: user.middleName,
            role: user.role,
          }),
        });
      } else {
        res = await fetch("/api/users", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
            first_name: user.firstName,
            middle_name: user.middleName,
            last_name: user.lastName,
            role: user.role,
          }),
        });
      }
      if (res.ok) {
        closeModal();
        router.refresh();
      } else {
        setError(
          `Failed to ${existing ? "update" : "add"} user. Please try again.`,
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
        <h2 className="text-xl font-bold">{existing ? "Edit" : "Add"} user</h2>
        {/* TODO: add option to import csv/json when bulk creating users */}
        <label className={labelStyles}>
          <div>
            First Name <span className="text-red-500">*</span>
          </div>
          <Input
            value={user.firstName}
            setValue={(firstName) => setUser({ ...user, firstName })}
          />
        </label>
        <label className={labelStyles}>
          Middle Name
          <Input
            value={user.middleName || ""}
            setValue={(middleName) => setUser({ ...user, middleName })}
          />
        </label>
        <label className={labelStyles}>
          <div>
            Last Name <span className="text-red-500">*</span>
          </div>
          <Input
            value={user.lastName}
            setValue={(lastName) => setUser({ ...user, lastName })}
          />
        </label>
        {!existing && (
          <>
            <label className={labelStyles}>
              <div>
                Username <span className="text-red-500">*</span>
              </div>
              <Input
                value={user.username}
                setValue={(username) => setUser({ ...user, username })}
              />
            </label>
            <label className={labelStyles}>
              Password
              <Input
                value={user.password || ""}
                setValue={(password) => setUser({ ...user, password })}
                type="password"
              />
            </label>
          </>
        )}
        <div className={labelStyles}>
          <div>
            Role <span className="text-red-500">*</span>
          </div>
          <Dropdown
            value={user.role[0].toUpperCase() + user.role.slice(1)}
            setValue={(role) =>
              setUser({
                ...user,
                role: role.toLowerCase() as RoleType,
              })
            }
            values={displayRoles}
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

export default NewUserModal;
