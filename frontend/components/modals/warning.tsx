"use client";

import { FaExclamationTriangle } from "react-icons/fa";
import Modal from "../ui/modal";
import Btn from "../ui/btn";

interface WarningModalProps {
  title: string;
  description: string;
  confirm: () => void;
  closeModal: () => void;
  loading?: boolean;
  error?: string;
  children?: React.ReactNode;
}

function WarningModal({
  title,
  description,
  confirm,
  closeModal,
  loading,
  error,
  children,
}: WarningModalProps) {
  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-zinc-700! dark:text-zinc-300! text-sm">
          {description}
        </p>
        {error && (
          <div className="text-red-500 text-sm flex gap-x-3 items-center">
            <FaExclamationTriangle size={15} /> {error}
          </div>
        )}
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Loading..." : "Confirm"}
            onclick={confirm}
            styles="text-sm bg-red-500! border-red-500! text-white!"
            primary
          />
          {children}
          <Btn text="Cancel" onclick={closeModal} styles="text-sm" />
        </div>
      </div>
    </Modal>
  );
}

export default WarningModal;
