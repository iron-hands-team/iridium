"use client";

import { useState, useEffect } from "react";
import { mapUrl } from "@/lib/helpers";
import { FaImage } from "react-icons/fa";
import Modal from "../ui/modal";
import Image from "next/image";
import Btn from "../ui/btn";
import Input from "../ui/input";

function NewMapModal({ closeModal }: { closeModal: () => void }) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<number | boolean | null>(null);
  const [removed, setRemoved] = useState<boolean>(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles((prev) => {
      const next = prev ? [...prev] : [];
      next[index] = file;
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    if (removed) {
      await fetch(`/api/map/upload`, {
        method: "DELETE",
      });
      setSaving(false);
      closeModal();
      return;
    }
    const res = await fetch(`/api/map/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ labels }),
    }).then((res) => res.json());
    const uploadUrls: string[] = res.uploads;
    if (files) {
      await Promise.all(
        uploadUrls.map((url, i) =>
          files[i]
            ? fetch("/s3" + url, {
                method: "PUT",
                headers: {
                  "Content-Type": files[i].type,
                },
                body: files[i],
              })
            : Promise.resolve(),
        ),
      );
    }
    setSaving(false);
    closeModal();
  }

  useEffect(() => {
    async function getMapData() {
      const res = await fetch("/api/map").then((res) => res.json());
      const parsedLabels = res.map((item: { label: string }) => item.label);
      setLabels(parsedLabels);
      setLoaded(parsedLabels.length > 0 ? parsedLabels.length : false);
    }
    getMapData();
  }, []);

  return (
    loaded !== null && (
      <Modal closeModal={closeModal}>
        <div className="flex flex-col gap-y-5 p-5">
          <h2 className="text-xl font-bold flex items-center gap-x-3">
            {loaded ? "Edit" : "Add"} map
          </h2>
          {labels.length > 0 ? (
            labels.map((l, i) => {
              return (
                <div key={i} className="flex flex-col gap-y-3">
                  <label className="text-sm flex flex-col gap-y-1">
                    Label {i + 1}
                    <Input
                      placeholder={`Floor ${i + 1} map`}
                      value={l}
                      setValue={(v) =>
                        setLabels([
                          ...labels.slice(0, i),
                          v,
                          ...labels.slice(i + 1),
                        ])
                      }
                    />
                  </label>
                  <label
                    className="cursor-pointer border border-zinc-800 flex flex-col p-5 gap-y-5 text-zinc-700 dark:text-zinc-300 items-center hover:bg-zinc-900"
                    title="Upload image"
                  >
                    {i < (loaded as number) || (files && files[i]) ? (
                      <Image
                        src={
                          files && files[i]
                            ? URL.createObjectURL(files[i])
                            : mapUrl(i)
                        }
                        alt="Map item image"
                        width={150}
                        height={150}
                        unoptimized
                      />
                    ) : (
                      <FaImage size={150} />
                    )}
                    {files && files[i] ? (
                      <div className="flex flex-col gap-y-1 items-center">
                        <div>{files[i].name} </div>
                        <div>
                          {files[i].size > 1000000
                            ? `${Math.round(files[i].size / 10000) / 100} MB`
                            : `${Math.round(files[i].size / 10) / 100} KB`}
                        </div>
                      </div>
                    ) : (
                      <div>Upload .png .jpg .webp image</div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleUpload(e, i)}
                    />
                  </label>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-center text-zinc-700 dark:text-zinc-300 py-5">
              No map items found. Add one below!
            </div>
          )}
          <Btn text="Add item" onclick={() => setLabels([...labels, ""])} />
          <div className="flex gap-x-3">
            <Btn
              text={saving ? "Saving..." : "Save"}
              onclick={handleSave}
              primary
            />
            <Btn
              text="Remove"
              onclick={() => {
                setFiles(null);
                setLabels([]);
                setRemoved(true);
              }}
              styles={!labels ? "opacity-0 pointer-events-none" : "opacity-100"}
            />
          </div>
        </div>
      </Modal>
    )
  );
}

export default NewMapModal;