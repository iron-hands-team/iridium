"use client";

import { guideSchema, type GuideType } from "@/lib/schemas";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import Btn from "../ui/btn";
import { AnimatePresence } from "framer-motion";
import WarningModal from "./warning";

const labelStyles = "text-sm flex flex-col gap-y-1";

interface GuideModalProps {
  existing?: GuideType;
  closeModal: () => void;
  toast: (msg: string) => void;
}

function NewGuideModal({ existing, closeModal, toast }: GuideModalProps) {
  const [guide, setGuide] = useState<GuideType>(
    existing || {
      title: "",
      sections: [{ subheading: "", text: "" }],
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const router = useRouter();

  async function handleSave() {
    const validated = guideSchema.safeParse(guide);
    if (validated.success) {
      setError(null);
      setLoading(true);
      console.log(validated.data);
      const res = existing
        ? await fetch(`/api/guides/${existing.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(validated.data),
          })
        : await fetch("/api/guides", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validated.data),
          });
      if (res.ok) {
        toast(`Guide ${existing ? "updated" : "added"} successfully!`);
        router.refresh();
        closeModal();
      } else {
        setError("Something went wrong, please try again");
      }
      setLoading(false);
    } else {
      setError(validated.error.issues[0].message);
    }
  }

  async function handleDelete() {
    if (deleting && existing) {
      setLoading(true);
      const res = await fetch(`/api/guides/${existing.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setError(null);
        toast("Guide deleted successfully!");
        router.refresh();
        closeModal();
      } else {
        setError("Something went wrong, please try again");
      }
      setLoading(false);
      setDeleting(false);
    }
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">{existing ? "Edit" : "Add"} guide</h2>
        <label className={labelStyles}>
          <div>
            Title <span className="text-red-500">*</span>
          </div>
          <Input
            placeholder="What is this guide?"
            value={guide.title}
            setValue={(title) => setGuide({ ...guide, title })}
          />
        </label>
        <label className={labelStyles}>
          <div>Description</div>
          <Textarea
            placeholder="Describe what this guide is about"
            styles="text-base!"
            value={guide.description || ""}
            setValue={(description) => setGuide({ ...guide, description })}
          />
        </label>
        <label className={labelStyles}>
          <div>Label</div>
          <Input
            placeholder="Feature"
            value={guide.label || ""}
            setValue={(label) => setGuide({ ...guide, label })}
          />
        </label>
        <div className="flex flex-col gap-y-3">
          {guide.sections.length > 0 ? (
            guide.sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center relative text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  <h2>Section #{i + 1}</h2>
                  {guide.sections.length > 1 && (
                    <FaTrash
                      size={13}
                      className="text-red-500 cursor-pointer absolute right-0"
                      title="Remove section"
                      onMouseDown={() =>
                        setGuide({
                          ...guide,
                          sections: [
                            ...guide.sections.slice(0, i),
                            ...guide.sections.slice(i + 1),
                          ],
                        })
                      }
                    />
                  )}
                </div>
                <div className="flex flex-col gap-y-3 border border-zinc-800 p-3">
                  <label className={labelStyles}>
                    <div>
                      Subheading <span className="text-red-500">*</span>
                    </div>
                    <Input
                      placeholder="What is this section?"
                      value={section.subheading}
                      setValue={(subheading) =>
                        setGuide({
                          ...guide,
                          sections: [
                            ...guide.sections.slice(0, i),
                            { ...section, subheading },
                            ...guide.sections.slice(i + 1),
                          ],
                        })
                      }
                    />
                  </label>
                  <label className={labelStyles}>
                    <div>
                      Text <span className="text-red-500">*</span>
                    </div>
                    <Textarea
                      placeholder="What is it about?"
                      styles="text-base!"
                      value={section.text}
                      setValue={(text) =>
                        setGuide({
                          ...guide,
                          sections: [
                            ...guide.sections.slice(0, i),
                            { ...section, text },
                            ...guide.sections.slice(i + 1),
                          ],
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div>No sections added, add one below!</div>
          )}
          <Btn
            text="Add section"
            onclick={() =>
              setGuide({
                ...guide,
                sections: [...guide.sections, { subheading: "", text: "" }],
              })
            }
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm flex gap-x-3 items-center">
            <FaExclamationTriangle size={15} /> {error}
          </div>
        )}
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Loading..." : "Save"}
            onclick={handleSave}
            primary
          />
          {existing && (
            <Btn
              text="Delete"
              onclick={() => setDeleting(true)}
              styles="text-sm bg-red-500! border-red-500!"
            />
          )}
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
      <AnimatePresence>
        {deleting && (
          <WarningModal
            title="Guide delete confirmation"
            description="Are you sure you want to delete this guide? This action is irreversible."
            confirm={handleDelete}
            closeModal={() => setDeleting(false)}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default NewGuideModal;
