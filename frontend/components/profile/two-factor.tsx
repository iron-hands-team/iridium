"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import Input from "../ui/input";

function TwoFactor() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(
    null,
  );
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disabling, setDisabling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/2fa")
      .then((res) => res.json())
      .then((data) => setEnabled(data.enabled))
      .catch(() => setEnabled(null));
  }, []);

  async function startSetup() {
    setError(null);
    const res = await fetch("/api/2fa/setup", { method: "POST" });
    if (res.ok) setSetup(await res.json());
    else setError("Something went wrong, please try again");
  }

  async function enable() {
    setError(null);
    const res = await fetch("/api/2fa/enable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      toast.success("Two-factor authentication enabled");
      setEnabled(true);
      setSetup(null);
      setCode("");
    } else {
      setError((await res.json()).detail);
    }
  }

  async function disable() {
    setError(null);
    const res = await fetch("/api/2fa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, code }),
    });
    if (res.ok) {
      toast.success("Two-factor authentication disabled");
      setEnabled(false);
      setDisabling(false);
      setCode("");
      setPassword("");
    } else {
      setError((await res.json()).detail);
    }
  }

  if (enabled === null) return null;

  return (
    <div className="flex flex-col gap-y-3 border-t border-zinc-800 pt-5">
      <div className="text-black dark:text-white font-bold">
        Two-factor authentication: {enabled ? "on" : "off"}
      </div>
      {!enabled && !setup && <Btn text="Set up 2FA" onclick={startSetup} />}
      {setup && (
        <div className="flex flex-col gap-y-3">
          <div>
            Add this key to an authenticator app (Google Authenticator, Authy,
            1Password), then enter the 6-digit code it shows.
          </div>
          <code className="break-all bg-zinc-200 dark:bg-zinc-900 p-2 select-all">
            {setup.secret}
          </code>
          <Input placeholder="123456" value={code} setValue={setCode} />
          <Btn text="Turn on" onclick={enable} primary />
        </div>
      )}
      {enabled && !disabling && (
        <Btn text="Turn off 2FA" onclick={() => setDisabling(true)} />
      )}
      {enabled && disabling && (
        <div className="flex flex-col gap-y-3">
          <Input
            placeholder="Password"
            value={password}
            setValue={setPassword}
            type="password"
          />
          <Input placeholder="123456" value={code} setValue={setCode} />
          <Btn text="Confirm turn off" onclick={disable} primary />
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default TwoFactor;
