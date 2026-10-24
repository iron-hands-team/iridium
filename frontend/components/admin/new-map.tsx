"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import NewMapModal from "../modals/new-map";

function NewMap() {
  const [adding, setAdding] = useState<boolean>(false);

  return (
    <div>
      <Btn text="Edit map" styles="w-full" onclick={() => setAdding(true)} />
      <AnimatePresence>
        {adding && (
          <NewMapModal
            closeModal={() => setAdding(false)}
            toast={(m) => toast(m)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default NewMap;
