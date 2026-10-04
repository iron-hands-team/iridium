"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Btn from "../ui/btn";
import NewMapModal from "../modals/new-map";

function NewMap() {
  const [adding, setAdding] = useState<boolean>(false);

  return (
    <div>
      <Btn text="Edit map" styles="w-full" onclick={() => setAdding(true)} />
      <AnimatePresence>
        {adding && <NewMapModal closeModal={() => setAdding(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default NewMap;
