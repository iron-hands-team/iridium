"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

function Modal({ children, closeModal }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!modalRef.current?.contains(e.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [closeModal]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      className="fixed top-0 left-0 w-screen h-screen bg-zinc-100/70 dark:bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center z-20"
    >
      <motion.div
        initial={{ scale: 0, y: 150 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 150 }}
        transition={{ duration: 0.7, type: "spring" }}
        ref={modalRef}
        className="w-100 max-h-120 border border-zinc-800 bg-zinc-100 dark:bg-zinc-950 overflow-y-auto"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;
