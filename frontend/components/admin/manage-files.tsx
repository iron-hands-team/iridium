"use client";

import { newFileSchema, type FileType } from "@/lib/schemas";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  FaExclamationTriangle,
  FaFile,
  FaPaperclip,
  FaTrash,
} from "react-icons/fa";
import { fileUrl } from "@/lib/helpers";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import Image from "next/image";

const labelStyles = "text-sm flex flex-col gap-y-1";

function ManageFiles() {
  const [editing, setEditing] = useState<boolean>(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const validated = newFileSchema.safeParse(files);
    if (validated.success) {
      setLoading(true);
      const res = await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated.data),
      });
      if (res.ok) {
        setError(null);
        const uploadData = await res.json();
        const uploadUrls: string[] = uploadData.uploads;
        if (files) {
          await Promise.all(
            uploadUrls.map((url, i) => {
              const file = files[i];
              return file.file
                ? fetch("/s3" + url, {
                    method: "PUT",
                    headers: {
                      "Content-Type": file.file.type,
                    },
                    body: file.file,
                  })
                : Promise.resolve();
            }),
          );
        }
        toast.success("Files uploaded successfully!");
        setEditing(false);
      } else {
        setError("Something went wrong, please try again");
      }
    } else {
      setError(validated.error.issues[0].message);
    }
    setLoading(false);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ft = file.type;
    setFiles([
      ...files.slice(0, i),
      {
        ...files[i],
        file,
        type: ft.startsWith("image/")
          ? "Image"
          : ft.startsWith("video/")
            ? "Video"
            : ft === "application/pdf"
              ? "PDF"
              : ft.includes("word")
                ? "Document"
                : "Other",
      },
      ...files.slice(i + 1),
    ]);
  }

  useEffect(() => {
    async function fetchFiles() {
      const res: FileType[] = await fetch("/api/files").then((res) =>
        res.json(),
      );
      setFiles(res);
    }
    if (editing) fetchFiles();
  }, [editing]);

  return (
    <>
      <Btn text="Edit files" onclick={() => setEditing(true)} />
      <AnimatePresence>
        {editing && (
          <Modal closeModal={() => setEditing(false)}>
            <div className="flex flex-col gap-y-5 p-5">
              <h2 className="text-xl font-bold flex items-center gap-x-3">
                Edit files
              </h2>
              {files.length > 0 ? (
                files.map((file, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                      <div className="flex items-center gap-x-2">
                        <FaFile size={13} /> File #{i + 1}
                      </div>
                      <FaTrash
                        size={13}
                        className="text-red-500 cursor-pointer"
                        onClick={() =>
                          setFiles([
                            ...files.slice(0, i),
                            ...files.slice(i + 1),
                          ])
                        }
                        title="Delete file"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3 pb-5">
                      <label
                        title="Upload file"
                        className="cursor-pointer border border-zinc-800 flex flex-col p-5 gap-y-5 text-zinc-700 dark:text-zinc-300 items-center text-sm hover:bg-zinc-200 dark:hover:bg-zinc-900"
                      >
                        {file.file || file.id ? (
                          <>
                            {file.type === "Image" ? (
                              <Image
                                src={
                                  file.file
                                    ? URL.createObjectURL(file.file)
                                    : fileUrl(i)
                                }
                                alt="Uploaded image"
                                width={150}
                                height={150}
                                unoptimized
                              />
                            ) : file.type ? (
                              <>
                                <FaPaperclip size={30} />
                                Uploaded {file.type}
                              </>
                            ) : null}
                            {file.file && (
                              <div className="flex flex-col gap-y-1 items-center">
                                <div>{file.file.name} </div>
                                <div>
                                  {file.file.size > 1000000
                                    ? `${Math.round(file.file.size / 10000) / 100} MB`
                                    : `${Math.round(file.file.size / 10) / 100} KB`}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <FaFile size={75} />
                            <div className="text-sm text-center">
                              Upload an image, video, PDF, document, or another
                              file
                            </div>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleUpload(e, i)}
                        />
                      </label>
                      <label className={labelStyles}>
                        <div>
                          Title <span className="text-red-500">*</span>
                        </div>
                        <Input
                          placeholder="School photo"
                          value={file.title}
                          setValue={(title) =>
                            setFiles([
                              ...files.slice(0, i),
                              { ...file, title },
                              ...files.slice(i + 1),
                            ])
                          }
                        />
                      </label>
                      <label className={labelStyles}>
                        Description
                        <Textarea
                          placeholder="Take a look at our magnificent school campus!"
                          value={file.description || ""}
                          setValue={(description) =>
                            setFiles([
                              ...files.slice(0, i),
                              { ...file, description },
                              ...files.slice(i + 1),
                            ])
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-center text-zinc-700 dark:text-zinc-300 py-5">
                  No files uploaded yet. Add one below!
                </div>
              )}
              <Btn
                text="Add file"
                onclick={() => setFiles([...files, { title: "" }])}
              />
              {error && (
                <div className="text-red-500 text-sm flex gap-x-3 items-center">
                  <FaExclamationTriangle size={15} /> {error}
                </div>
              )}
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Saving..." : "Save"}
                  onclick={handleSave}
                  primary
                />
                <Btn text="Cancel" onclick={() => setEditing(false)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default ManageFiles;
