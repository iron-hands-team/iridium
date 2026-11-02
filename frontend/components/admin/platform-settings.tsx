"use client";

import { settingsSchema, type SettingsType } from "@/lib/schemas";
import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Checkbox from "../ui/checkbox";
import Dropdown from "../ui/dropdown";
import Btn from "../ui/btn";
import WarningModal from "../modals/warning";

const labelStyles =
  "text-sm flex flex-col gap-y-2 text-zinc-700 dark:text-zinc-300";
const features = [
  "Classes",
  "Schedule",
  "Calendar",
  "Clubs",
  "Messages",
  "Chat",
];
const durations = ["Hours", "Days", "Weeks", "Months", "Years"];

function PlatformSettings() {
  const [open, setOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<SettingsType>({
    features,
    archive: { number: 30, duration: "Days", never: false },
    messages: { number: 30, duration: "Days", never: false },
    slow: { number: 30, duration: "Seconds", enabled: false },
    censored: { words: [], sensitive: false },
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [censored, setCensored] = useState<string>("");
  const [pausing, setPausing] = useState<boolean>(false);
  const [clearing, setClearing] = useState<boolean>(false);

  function handleCensor(e: React.SubmitEvent) {
    e.preventDefault();
    if (censored.trim().replaceAll(",", "").length > 0) {
      const processed = censored
        .replaceAll("\\,", "\\")
        .split(",")
        .reduce((acc: string[], p) => {
          const current = p.replaceAll("\\", ",").trim();
          acc =
            current.length > 0 &&
            !settings.censored.words.includes(current) &&
            !acc.includes(current)
              ? [...acc, current]
              : acc;
          return acc;
        }, []);
      setSettings({
        ...settings,
        censored: {
          ...settings.censored,
          words: [...settings.censored.words, ...processed],
        },
      });
      setCensored("");
    }
  }

  async function handlePause(password: string) {
    const res = await fetch("/api/pause", { method: "POST", body: password });
    if (res.ok) {
      setError(null);
      toast.success("Operations paused successfully!");
      setPausing(false);
    } else {
      setError("Something went wrong, please try again");
    }
  }

  async function handleClear(password: string) {
    const res = await fetch("/api/clear", { method: "DELETE", body: password });
    if (res.ok) {
      setError(null);
      window.open("/", "_self");
      setClearing(false);
    } else {
      setError("Something went wrong, please try again");
    }
  }

  async function handleSave() {
    const validated = settingsSchema.safeParse(settings);
    if (validated.success) {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated.data),
      });
      if (res.ok) {
        toast.success("Settings updated successfully!");
        setOpen(false);
      } else {
        setError("Something went wrong, please try again");
      }
      setLoading(false);
    } else {
      setError(validated.error.issues[0].message);
    }
  }

  useEffect(() => {
    setError(null);
  }, [open]);

  return (
    <>
      <Btn text="Platform settings" onclick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <Modal closeModal={() => setOpen(false)}>
            <div className="flex flex-col gap-y-5 p-5">
              <h2 className="text-xl font-bold flex items-center gap-x-3">
                Iridium settings
              </h2>
              <div className={labelStyles}>
                Enabled features
                <div className="flex flex-col gap-y-2 text-base">
                  {features.map((f, i) => (
                    <Checkbox
                      key={i}
                      text={f}
                      checked={settings.features.includes(f)}
                      setChecked={(v) =>
                        setSettings({
                          ...settings,
                          features: v
                            ? [...settings.features, f]
                            : settings.features.filter((c) => c !== f),
                        })
                      }
                      styles="w-full"
                    />
                  ))}
                </div>
              </div>
              <div className={labelStyles}>
                Auto-archive announcements after
                <div className="flex flex-col gap-y-2">
                  <Checkbox
                    text="Never"
                    checked={settings.archive.never}
                    setChecked={(never) =>
                      setSettings({
                        ...settings,
                        archive: { ...settings.archive, never },
                      })
                    }
                  />
                  {!settings.archive.never && (
                    <div className="flex gap-x-3">
                      <Input
                        type="number"
                        value={settings.archive.number.toString()}
                        setValue={(n) =>
                          setSettings({
                            ...settings,
                            archive: { ...settings.archive, number: Number(n) },
                          })
                        }
                        full
                      />
                      <Dropdown
                        value={settings.archive.duration}
                        setValue={(duration) =>
                          setSettings({
                            ...settings,
                            archive: { ...settings.archive, duration },
                          })
                        }
                        values={durations}
                        right
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className={labelStyles}>
                Auto-delete chat messages after
                <div className="flex flex-col gap-y-2">
                  <Checkbox
                    text="Never"
                    checked={settings.messages.never}
                    setChecked={(never) =>
                      setSettings({
                        ...settings,
                        messages: { ...settings.messages, never },
                      })
                    }
                  />
                  {!settings.messages.never && (
                    <div className="flex gap-x-3">
                      <Input
                        type="number"
                        value={settings.messages.number.toString()}
                        setValue={(n) =>
                          setSettings({
                            ...settings,
                            messages: {
                              ...settings.messages,
                              number: Number(n),
                            },
                          })
                        }
                        full
                      />
                      <Dropdown
                        value={settings.messages.duration}
                        setValue={(duration) =>
                          setSettings({
                            ...settings,
                            messages: { ...settings.messages, duration },
                          })
                        }
                        values={durations}
                        right
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className={labelStyles}>
                Censored words/phrases in Chat
                <div className="flex gap-3 flex-wrap">
                  {settings.censored.words.length > 0 ? (
                    settings.censored.words.map((c, i) => (
                      <div
                        key={i}
                        className="bg-zinc-200 dark:bg-zinc-900 flex items-center px-2 py-1 w-fit text-zinc-700 dark:text-zinc-300 gap-x-2"
                      >
                        {c}
                        <FaXmark
                          size={13}
                          title="Remove word/phrase"
                          className="cursor-pointer"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              censored: {
                                ...settings.censored,
                                words: [
                                  ...settings.censored.words.slice(0, i),
                                  ...settings.censored.words.slice(i + 1),
                                ],
                              },
                            })
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-zinc-700 dark:text-zinc-300">
                      No censored words/phrases added, are you really keeping
                      the school community safe?
                    </div>
                  )}
                </div>
                <form onSubmit={handleCensor}>
                  <Input
                    placeholder="Separate phrases by comma, \ to escape it"
                    value={censored}
                    setValue={(c) => setCensored(c)}
                  />
                </form>
                <Checkbox
                  text="Case sensitive"
                  checked={settings.censored.sensitive}
                  setChecked={(sensitive) =>
                    setSettings({
                      ...settings,
                      censored: { ...settings.censored, sensitive },
                    })
                  }
                />
              </div>
              <div className={labelStyles}>
                Chat slow mode
                <div className="flex flex-col gap-y-2">
                  <Checkbox
                    text="Enabled"
                    checked={settings.slow.enabled}
                    setChecked={(enabled) =>
                      setSettings({
                        ...settings,
                        slow: { ...settings.slow, enabled },
                      })
                    }
                  />
                  {settings.slow.enabled && (
                    <div className="flex gap-x-3">
                      <Input
                        type="number"
                        value={settings.slow.number.toString()}
                        setValue={(n) =>
                          setSettings({
                            ...settings,
                            slow: { ...settings.slow, number: Number(n) },
                          })
                        }
                        full
                      />
                      <Dropdown
                        value={settings.slow.duration}
                        setValue={(duration) =>
                          setSettings({
                            ...settings,
                            slow: { ...settings.slow, duration },
                          })
                        }
                        values={["Seconds", "Minutes", "Hours"]}
                        right
                      />
                    </div>
                  )}
                </div>
              </div>
              <Btn
                text="Pause operations"
                onclick={() => setPausing(true)}
                styles="text-sm bg-red-500! border-red-500! text-white! w-fit"
                primary
              />
              <Btn
                text="Clear data"
                onclick={() => setClearing(true)}
                styles="text-sm bg-red-500! border-red-500! text-white! w-fit"
                primary
              />
              {error && (
                <div className="text-red-500 text-sm flex gap-x-3 items-center">
                  <FaExclamationTriangle size={15} /> {error}
                </div>
              )}
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Saving..." : "Save"}
                  onclick={handleSave}
                  primary
                />
                <Btn text="Cancel" onclick={() => setOpen(false)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pausing && (
          <WarningModal
            title="Pause operations"
            description="Are you sure you want to temporarily pause all backend operations and stop users from interacting with Iridium? Only use this if the platform is undergoing maintenance or if there is an emergency. You can unpause it anytime. Please confirm your admin password to continue."
            confirm={() => undefined}
            closeModal={() => setPausing(false)}
            error={error || undefined}
            password={handlePause}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {clearing && (
          <WarningModal
            title="Clear data"
            description="Are you absolutely sure you want to CLEAR ALL DATA ON IRIDIUM? This will permanently wipe everything from the database and reseed the default users. This action is irreversible. Please confirm your admin password to continue."
            confirm={() => undefined}
            closeModal={() => setClearing(false)}
            error={error || undefined}
            password={handleClear}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default PlatformSettings;
