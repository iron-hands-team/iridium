"use client";

import { FaExclamationTriangle, FaKey } from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Btn from "../ui/btn";

function PasswordReset({ username }: { username: string }) {
  const [resetting, setResetting] = useState<boolean>(false);
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSave(clear?: boolean) {
    const p1 = password1.trim();
    const p2 = password2.trim();
    if (p1.length == 0 || p1.length > 7) {
      if (p1 === p2) {
        setError(null);
        setLoading(true);
        const res = await fetch(`/api/users/${username}/reset`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clear, password: p1 }),
        });
        setLoading(false);
        if (res.ok) {
          router.refresh();
          setResetting(false);
        } else {
          setError("Something went wrong, please try again");
        }
      } else {
        setError("Passwords have to match");
      }
    } else {
      setError("Password has to be either empty or at least 8 characters long");
    }
  }

  return (
    <div className="cursor-default">
      <FaKey
        size={15}
        title="This user is requesting a password reset"
        className="text-yellow-400 cursor-pointer"
        onClick={() => setResetting(true)}
      />
      <AnimatePresence>
        {resetting && (
          <Modal closeModal={() => setResetting(false)}>
            <div className="flex flex-col gap-y-5 p-5">
              <h2 className="text-xl font-bold flex items-center gap-x-3">
                Reset password for {username}
              </h2>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password1}
                setValue={(p) => setPassword1(p)}
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={password2}
                setValue={(p) => setPassword2(p)}
              />
              {error && (
                <div className="text-red-500 text-sm flex gap-x-3 items-center">
                  <FaExclamationTriangle size={15} /> {error}
                </div>
              )}
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Saving..." : "Save"}
                  onclick={() => handleSave()}
                  styles="text-sm"
                  primary
                />
                <Btn
                  text="Clear request"
                  styles="text-sm bg-red-500! border-red-500! text-white!"
                  onclick={() => handleSave(true)}
                />
                <Btn
                  text="Cancel"
                  onclick={() => setResetting(false)}
                  styles="text-sm"
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PasswordReset;
