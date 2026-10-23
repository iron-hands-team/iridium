"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload, FaCheckCircle } from "react-icons/fa";

function Submission({
  assignmentId,
  submittedAt,
}: {
  assignmentId: number;
  submittedAt: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ filename: file.name }),
    }).then((res) => res.json());
    await fetch("/s3" + res.presigned_url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    setUploading(false);
    router.refresh();
  }

  return (
    <label className="text-xs cursor-pointer flex items-center gap-x-1 text-zinc-500 hover:text-black dark:hover:text-zinc-300">
      {uploading ? (
        "Uploading..."
      ) : submittedAt ? (
        <>
          <FaCheckCircle className="text-green-500" />
          Submitted {new Date(submittedAt).toLocaleDateString()} (replace)
        </>
      ) : (
        <>
          <FaUpload />
          Turn in
        </>
      )}
      <input type="file" className="hidden" onChange={handleFile} />
    </label>
  );
}

export default Submission;