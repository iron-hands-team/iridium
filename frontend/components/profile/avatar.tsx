"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import AvatarModal from "../modals/avatar";

interface AvatarProps {
  image?: string;
  canEdit: boolean;
  username: string;
}

function Avatar({ image, canEdit, username }: AvatarProps) {
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <>
      <div
        className={canEdit ? "cursor-pointer" : ""}
        title={canEdit ? "Edit profile picture" : ""}
        onClick={() => (canEdit ? setEditing(true) : null)}
      >
        {image ? (
          <Image
            src={image}
            alt="User avatar"
            width={150}
            height={150}
            className="mx-auto my-5"
            unoptimized
          />
        ) : (
          <FaUserCircle size={150} className="mx-auto my-5" />
        )}
      </div>
      <AnimatePresence>
        {editing && (
          <AvatarModal
            closeModal={() => setEditing(false)}
            imageUrl={image}
            username={username}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Avatar;
