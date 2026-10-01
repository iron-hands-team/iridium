"use client";

import { FaUserCircle } from "react-icons/fa";
import Modal from "../ui/modal";
import Image from "next/image";
import Btn from "../ui/btn";

interface AvatarModalProps {
  closeModal: () => void;
  image?: string;
}

function AvatarModal({ closeModal, image }: AvatarModalProps) {
  async function handleSave() {
    console.log("save");
  }

  async function handleRemove() {
    console.log("remove");
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          Edit profile picture
        </h2>
        <label
          className="cursor-pointer border border-zinc-800 flex flex-col p-5 gap-y-5 text-zinc-700 dark:text-zinc-300 items-center hover:bg-zinc-900"
          title="Upload image"
        >
          {image ? (
            <Image src={image} alt="User avatar" width={150} height={150} />
          ) : (
            <FaUserCircle size={150} />
          )}
          <div>Upload .png .jpg .webp image</div>
          <input type="file" className="hidden" />
        </label>
        <div className="flex gap-x-3">
          <Btn text="Save" onclick={handleSave} primary />
          <Btn text="Remove" onclick={handleRemove} />
        </div>
      </div>
    </Modal>
  );
}

export default AvatarModal;
