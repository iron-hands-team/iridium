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
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [codesLeft, setCodesLeft] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/2fa")
      .then((res) => res.json())
      .then((data) => {
        setEnabled(data.enabled);
        setCodesLeft(data.recovery_codes_left);
      })
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
      const data = await res.json();
      setRecoveryCodes(data.recovery_codes);
      setCodesLeft(data.recovery_codes.length);
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

  async function regenerate() {
    setError(null);
    const res = await fetch("/api/2fa/recovery-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, code }),
    });
    if (res.ok) {
      const data = await res.json();
      setRecoveryCodes(data.recovery_codes);
      setCodesLeft(data.recovery_codes.length);
      setRegenerating(false);
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
      {recoveryCodes && (
        <div className="flex flex-col gap-y-2">
          <div>
            Save these recovery codes somewhere safe. Each works once if you
            lose your authenticator. They won&apos;t be shown again.
          </div>
          <code className="bg-zinc-200 dark:bg-zinc-900 p-2 select-all grid grid-cols-2 gap-1">
            {recoveryCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </code>
          <Btn text="I saved them" onclick={() => setRecoveryCodes(null)} />
        </div>
      )}
      {enabled && !recoveryCodes && !disabling && !regenerating && (
        <>
          <div>Recovery codes left: {codesLeft}</div>
          <Btn
            text="New recovery codes"
            onclick={() => setRegenerating(true)}
          />
          <Btn text="Turn off 2FA" onclick={() => setDisabling(true)} />
        </>
      )}
      {regenerating && (
        <div className="flex flex-col gap-y-3">
          <Input
            placeholder="Password"
            value={password}
            setValue={setPassword}
            type="password"
          />
          <Input placeholder="123456" value={code} setValue={setCode} />
          <Btn text="Generate new codes" onclick={regenerate} primary />
        </div>
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
