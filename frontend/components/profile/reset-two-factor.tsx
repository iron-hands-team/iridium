"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Btn from "../ui/btn";

function ResetTwoFactor({ username }: { username: string }) {
  const [confirming, setConfirming] = useState<boolean>(false);

  async function handleReset() {
    const res = await fetch(`/api/users/${username}/2fa`, { method: "DELETE" });
    if (res.ok) toast.success("Two-factor authentication reset");
    else toast.error("Something went wrong, please try again");
    setConfirming(false);
  }

  return confirming ? (
    <Btn text="Confirm 2FA reset" onclick={handleReset} primary />
  ) : (
    <Btn text="Reset 2FA" onclick={() => setConfirming(true)} />
  );
}

export default ResetTwoFactor;
