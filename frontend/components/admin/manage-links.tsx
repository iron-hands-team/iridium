"use client";

import type { LinkType } from "@/lib/schemas";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaLink, FaTrash } from "react-icons/fa";
import { newLinkSchema } from "@/lib/schemas";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import Input from "../ui/input";
import Checkbox from "../ui/checkbox";
import Modal from "../ui/modal";

const labelStyles = "text-sm flex flex-col gap-y-1";

function ManageLinks() {
  const [managing, setManaging] = useState<boolean>(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    const validated = newLinkSchema.safeParse(links);
    if (validated.success) {
      setError(null);
      const res = await fetch(`/api/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated.data),
      });
      if (res.ok) {
        toast.success("Links added successfully!");
        setManaging(false);
      } else {
        setError("Something went wrong, please try again.");
      }
    } else {
      setError(validated.error.issues[0].message);
    }
    setSaving(false);
  }

  useEffect(() => {
    async function fetchLinks() {
      const linkData: LinkType[] = await fetch(`/api/links`).then((res) =>
        res.json(),
      );
      if (linkData.length > 0) setLinks(linkData);
    }
    if (managing) fetchLinks();
  }, [managing]);

  return (
    <>
      <Btn text="Edit links" onclick={() => setManaging(true)} />
      <AnimatePresence>
        {managing && (
          <Modal closeModal={() => setManaging(false)}>
            <div className="flex flex-col gap-y-5 p-5">
              <h2 className="text-xl font-bold flex items-center gap-x-3">
                Edit links
              </h2>
              {links.length > 0 ? (
                links.map((link, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                      <div className="flex items-center gap-x-2">
                        <FaLink size={13} /> Link #{i + 1}
                      </div>
                      <FaTrash
                        size={13}
                        className="text-red-500 cursor-pointer"
                        onClick={() =>
                          setLinks([
                            ...links.slice(0, i),
                            ...links.slice(i + 1),
                          ])
                        }
                        title="Delete link"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3 border border-zinc-800 p-3">
                      <label className={labelStyles}>
                        <div>
                          Label text <span className="text-red-500">*</span>
                        </div>
                        <Input
                          placeholder="Hack Club"
                          value={link.label}
                          setValue={(label) =>
                            setLinks([
                              ...links.slice(0, i),
                              { ...link, label },
                              ...links.slice(i + 1),
                            ])
                          }
                        />
                      </label>
                      <label className={labelStyles}>
                        <div>
                          Link URL
                          <span className="text-red-500">*</span>
                        </div>
                        <Input
                          placeholder="hackclub.com"
                          value={link.href}
                          setValue={(href) =>
                            setLinks([
                              ...links.slice(0, i),
                              { ...link, href },
                              ...links.slice(i + 1),
                            ])
                          }
                        />
                      </label>
                      <Checkbox
                        text="Open in new tab"
                        checked={link.blank || false}
                        setChecked={(blank) =>
                          setLinks([
                            ...links.slice(0, i),
                            { ...link, blank },
                            ...links.slice(i + 1),
                          ])
                        }
                        styles="text-sm"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-center text-zinc-700 dark:text-zinc-300 py-5">
                  No links found. Add one below!
                </div>
              )}
              <Btn
                text="Add link"
                onclick={() => setLinks([...links, { label: "", href: "" }])}
              />
              {error && (
                <div className="text-red-500 text-sm flex gap-x-3 items-center">
                  <FaExclamationTriangle size={15} /> {error}
                </div>
              )}
              <div className="flex gap-x-3">
                <Btn
                  text={saving ? "Saving..." : "Save"}
                  onclick={handleSave}
                  primary
                />
                <Btn text="Cancel" onclick={() => setManaging(false)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default ManageLinks;
