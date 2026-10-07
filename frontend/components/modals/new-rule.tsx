"use client";

import type { RuleType } from "@/lib/schemas";
import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { newRulesSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import Btn from "../ui/btn";
import Input from "../ui/input";
import Modal from "../ui/modal";
import Textarea from "../ui/textarea";

const labelStyles =
  "text-black dark:text-zinc-300 text-sm flex flex-col gap-y-1 w-full";

interface NewRuleModalProps {
  existing?: RuleType[];
  closeModal: () => void;
}

function NewRuleModal({ existing, closeModal }: NewRuleModalProps) {
  const [rules, setRules] = useState<RuleType[]>(existing || []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const router = useRouter();

  async function handleSave() {
    setError(null);
    const validated = newRulesSchema.safeParse(rules);
    if (validated.success) {
      setLoading(true);
      await fetch("/api/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(validated.data),
      });
      setLoading(false);
      router.refresh();
      closeModal();
    } else {
      setError(validated.error.issues[0].message);
    }
  }

  useEffect(() => {
    async function fetchRules() {
      const rules: RuleType[] = await fetch("/api/rules", {
        method: "GET",
      }).then((res) => res.json());
      setRules(rules);
      setLoaded(true);
    }
    if (!existing) {
      fetchRules();
    } else {
      setLoaded(true);
    }
  }, [existing]);

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          {existing && existing.length > 0 ? "Edit" : "Add"} rules
        </h2>
        {rules.length > 0 ? (
          rules.map((rule, i) => (
            <div key={i} className="flex flex-col gap-y-3">
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                Rule #{i + 1}
              </div>
              <label className={labelStyles}>
                <div>
                  Name <span className="text-red-500">*</span>
                </div>
                <Input
                  placeholder="Grading policy"
                  value={rule.name}
                  setValue={(name) =>
                    setRules(
                      rules.map((r) => (r.id === rule.id ? { ...r, name } : r)),
                    )
                  }
                />
              </label>
              <label className={labelStyles}>
                Description
                <Textarea
                  placeholder="Everyone gets 100% on every test and assignment!!!"
                  value={rule.description || ""}
                  setValue={(description) =>
                    setRules(
                      rules.map((r) =>
                        r.id === rule.id ? { ...r, description } : r,
                      ),
                    )
                  }
                />
              </label>
              <div
                className="flex items-center gap-x-3 text-red-500 cursor-pointer hover:underline w-fit text-sm"
                onMouseDown={() =>
                  setRules(rules.filter((r) => r.id !== rule.id))
                }
              >
                <FaTrash size={15} /> Remove rule
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 text-zinc-700 dark:text-zinc-300 text-sm">
            {loaded ? "No rules found. Add one below!" : "Loading..."}
          </div>
        )}
        <Btn
          text="Add rule"
          onclick={() =>
            setRules([...rules, { id: rules.length + 1, name: "" }])
          }
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
          <Btn text="Cancel" onclick={() => closeModal()} />
        </div>
      </div>
    </Modal>
  );
}

export default NewRuleModal;
