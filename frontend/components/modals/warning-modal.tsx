"use client";

import Modal from "../ui/modal";
import Btn from "../ui/btn";

interface WarningModalProps {
  title: string;
  description: string;
  confirm: () => void;
  closeModal: () => void;
  loading?: boolean;
}

function WarningModal({
  title,
  description,
  confirm,
  closeModal,
  loading,
}: WarningModalProps) {
  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm">
          {description}
        </p>
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Loading..." : "Confirm"}
            onclick={confirm}
            styles="text-sm w-fit! bg-red-500! text-white!"
            primary
          />
          <Btn text="Cancel" onclick={closeModal} styles="text-sm w-fit!" />
        </div>
      </div>
    </Modal>
  );
}

export default WarningModal;
