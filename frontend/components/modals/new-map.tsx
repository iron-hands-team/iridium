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
  const [existing, setExisting] = useState<string[] | null>(null); //TODO: implement existing array that holds images from useeffect fetch to fix bugs related to order of uploading images and skipping items to upload

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFiles((prev) =>
        prev
          ? [...prev.slice(0, index), files[0], ...prev.slice(index + 1)]
          : [files[0]],
      );
    }
  }

  async function handleSave() {
    if (files) {
      setSaving(true);
      const res = await fetch(`/api/map/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ labels }),
      }).then((res) => res.json());
      const uploadUrls: string[] = res.uploads;
      uploadUrls.forEach(async (url, i) => {
        await fetch("/s3" + url, {
          method: "PUT",
          headers: {
            "Content-Type": files[i].type,
          },
          body: files[i],
        });
      });
      setSaving(false);
    } else if (loaded) {
      setSaving(true);
      await fetch(`/api/map/upload`, {
        method: "DELETE",
      });
      setSaving(false);
    }
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
