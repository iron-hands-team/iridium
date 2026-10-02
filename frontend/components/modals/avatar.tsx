"use client";

import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../ui/modal";
import Image from "next/image";
import Btn from "../ui/btn";

interface AvatarModalProps {
  closeModal: () => void;
  imageUrl?: string;
  username: string;
}

function AvatarModal({ closeModal, imageUrl, username }: AvatarModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(imageUrl || null);
  const [saving, setSaving] = useState<boolean>(false);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }

  async function handleSave() {
    if (file) {
      setSaving(true);
      const res = await fetch(`/api/users/upload/${username}`).then((res) =>
        res.json(),
      );
      const uploadUrl = res.presigned_url;
      if (uploadUrl) {
        const upload = await fetch("/s3" + uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        if (upload.ok) {
          setImage(
            `/s3/files/avatars/${username}/avatar?t=${new Date().getTime()}`,
          );
        }
      }
      setSaving(false);
      router.refresh();
      closeModal();
    }
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
          {image || file ? (
            <Image
              src={file ? URL.createObjectURL(file) : image!}
              alt="User avatar"
              width={150}
              height={150}
              unoptimized
            />
          ) : (
            <FaUserCircle size={150} />
          )}
          {file ? (
            <div className="flex flex-col gap-y-1 items-center">
              <div>{file.name} </div>
              <div>
                {file.size > 1000000
                  ? `${Math.round(file.size / 10000) / 100} MB`
                  : `${Math.round(file.size / 10) / 100} KB`}
              </div>
            </div>
          ) : (
            <div>Upload .png .jpg .webp image</div>
          )}
          <input
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleUpload}
          />
        </label>
        <div className="flex gap-x-3">
          <Btn
            text={saving ? "Saving..." : "Save"}
            onclick={handleSave}
            primary
          />
          <Btn
            text="Remove"
            onclick={() => {
              setFile(null);
              setImage(null);
            }}
            styles={!file ? "opacity-0 pointer-events-none" : "opacity-100"}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AvatarModal;
