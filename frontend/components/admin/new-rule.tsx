"use client";

import type { RuleType } from "@/lib/schemas";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Btn from "../ui/btn";
import NewRuleModal from "../modals/new-rule";

interface NewRuleProps {
  text?: string;
  existing?: RuleType[];
  primary?: boolean;
}

function NewRule({ text, existing, primary }: NewRuleProps) {
  const [adding, setAdding] = useState<boolean>(false);

  return (
    <>
      <Btn
        text={text || "New rule"}
        onclick={() => setAdding(true)}
        primary={primary}
      />
      <AnimatePresence>
        {adding && (
          <NewRuleModal
            closeModal={() => setAdding(false)}
            existing={existing}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default NewRule;
