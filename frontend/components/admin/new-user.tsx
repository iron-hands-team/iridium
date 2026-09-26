"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Btn from "../ui/btn";
import NewUserModal from "../modals/new-user";

interface NewUserProps {
  styles?: string;
  primary?: boolean;
}

function NewUser({ styles, primary }: NewUserProps) {
  const [adding, setAdding] = useState<boolean>(false);

  return (
    <div>
      <Btn
        text="New user"
        onclick={() => setAdding(true)}
        styles={styles}
        primary={primary}
      />
      <AnimatePresence>
        {adding && <NewUserModal closeModal={() => setAdding(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default NewUser;
