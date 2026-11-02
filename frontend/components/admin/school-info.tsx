"use client";

import { type SchoolType, newSchoolSchema } from "@/lib/schemas";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  FaExclamationTriangle,
  FaImage,
  FaLink,
  FaTrash,
} from "react-icons/fa";
import { fileUrl } from "@/lib/helpers";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import Modal from "../ui/modal";
import Image from "next/image";

const labelStyles = "text-sm flex flex-col gap-y-1";

function SchoolInfo() {
  const [school, setSchool] = useState<SchoolType>({ title: "", socials: [] });
  const [editing, setEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSchool({ ...school, logo: file });
  }

  async function handleSave() {
    setLoading(true);
    const validated = newSchoolSchema.safeParse(school);
    if (validated.success) {
      setError(null);
      const res = await fetch("/api/school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated.data),
      });
      if (res.ok) {
        const uploads = await res.json();
        await fetch(uploads.logo_url, {
          method: "PUT",
          headers: {
            "Content-Type": school.logo!.type,
          },
          body: school.logo,
        });
        await fetch(uploads.banner_url, {
          method: "PUT",
          headers: {
            "Content-Type": school.banner!.type,
          },
          body: school.banner,
        });
        toast.success("School information updated successfully!");
        setEditing(false);
      } else {
        setError("Something went wrong, please try again");
      }
      setLoading(false);
    } else {
      setError(validated.error.issues[0].message);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchInfo() {
      const res: SchoolType = await fetch("/api/school").then((res) =>
        res.json(),
      );
      if (res.id) setSchool(res);
      setLoaded(true);
    }
    if (editing && !school.id) {
      fetchInfo();
    }
  }, [school.id, editing]);

  return (
    <>
      <Btn text="School info" onclick={() => setEditing(true)} primary />
      <AnimatePresence>
        {editing && loaded && (
          <Modal closeModal={() => setEditing(false)}>
            <div className="flex flex-col gap-y-5 p-5">
              <h2 className="text-xl font-bold flex items-center gap-x-3">
                School information
              </h2>
              <div className={labelStyles}>
                School logo
                <label
                  title="Upload file"
                  className="cursor-pointer border border-zinc-800 flex flex-col p-5 gap-y-5 text-zinc-700 dark:text-zinc-300 items-center text-sm hover:bg-zinc-200 dark:hover:bg-zinc-900"
                >
                  {school.logo || school.id ? (
                    <>
                      <Image
                        src={
                          school.logo
                            ? URL.createObjectURL(school.logo)
                            : fileUrl(school.id as number) //TODO: upload school logo to different url
                        }
                        alt="Uploaded logo"
                        width={150}
                        height={150}
                        unoptimized
                      />
                      {school.logo && (
                        <div className="flex flex-col gap-y-1 items-center">
                          <div>{school.logo.name} </div>
                          <div>
                            {school.logo.size > 1000000
                              ? `${Math.round(school.logo.size / 10000) / 100} MB`
                              : `${Math.round(school.logo.size / 10) / 100} KB`}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <FaImage size={75} />
                      <div className="text-sm text-center">
                        Upload .png .jpg .webp image
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(e)}
                  />
                </label>
              </div>
              <div className={labelStyles}>
                School banner
                <label
                  title="Upload file"
                  className="cursor-pointer border border-zinc-800 flex flex-col p-5 gap-y-5 text-zinc-700 dark:text-zinc-300 items-center text-sm hover:bg-zinc-200 dark:hover:bg-zinc-900"
                >
                  {school.banner || school.id ? (
                    <>
                      <Image
                        src={
                          school.banner
                            ? URL.createObjectURL(school.banner)
                            : fileUrl(school.id as number) //TODO: upload school banner to different url
                        }
                        alt="Uploaded banner"
                        width={150}
                        height={150}
                        unoptimized
                      />
                      {school.banner && (
                        <div className="flex flex-col gap-y-1 items-center">
                          <div>{school.banner.name} </div>
                          <div>
                            {school.banner.size > 1000000
                              ? `${Math.round(school.banner.size / 10000) / 100} MB`
                              : `${Math.round(school.banner.size / 10) / 100} KB`}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <FaImage size={75} />
                      <div className="text-sm text-center">
                        Upload .png .jpg .webp image
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(e)}
                  />
                </label>
              </div>
              <label className={labelStyles}>
                <div>
                  Name <span className="text-red-500">*</span>
                </div>
                <Input
                  placeholder="Hogwarts"
                  value={school.title}
                  setValue={(title) => setSchool({ ...school, title })}
                />
              </label>
              <label className={labelStyles}>
                Description
                <Textarea
                  placeholder="Hogwarts School of Witchcraft and Wizardry is one of the best magical institutions in the world, offering a diverse and comprehensive assortment of various wizarding classes"
                  value={school.description || ""}
                  setValue={(description) =>
                    setSchool({ ...school, description })
                  }
                />
              </label>
              <label className={labelStyles}>
                Address
                <Input
                  placeholder="Scottish Highlands, Great Britain"
                  value={school.address || ""}
                  setValue={(address) => setSchool({ ...school, address })}
                />
              </label>
              <label className={labelStyles}>
                Email
                <Input
                  placeholder="office@hogwarts.edu"
                  value={school.email || ""}
                  setValue={(email) => setSchool({ ...school, email })}
                />
              </label>
              <label className={labelStyles}>
                Phone number
                <Input
                  placeholder="1234567890"
                  value={school.number || ""}
                  setValue={(number) => setSchool({ ...school, number })}
                  type="tel"
                />
              </label>
              {school.socials.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    <div className="flex items-center gap-x-2">
                      <FaLink size={13} /> Social #{i + 1}
                    </div>
                    <FaTrash
                      size={13}
                      className="text-red-500 cursor-pointer"
                      onClick={() =>
                        setSchool({
                          ...school,
                          socials: [
                            ...school.socials.slice(0, i),
                            ...school.socials.slice(i + 1),
                          ],
                        })
                      }
                      title="Delete social"
                    />
                  </div>
                  <div className="flex flex-col gap-y-3 border border-zinc-800 p-3">
                    <label className={labelStyles}>
                      <div>
                        Name <span className="text-red-500">*</span>
                      </div>
                      <Input
                        placeholder="Instagram"
                        value={s.name}
                        setValue={(name) =>
                          setSchool({
                            ...school,
                            socials: [
                              ...school.socials.slice(0, i),
                              { ...s, name },
                              ...school.socials.slice(i + 1),
                            ],
                          })
                        }
                      />
                    </label>
                    <label className={labelStyles}>
                      <div>
                        Link <span className="text-red-500">*</span>
                      </div>
                      <Input
                        placeholder="instagram.com/hogwarts"
                        value={s.link}
                        setValue={(link) =>
                          setSchool({
                            ...school,
                            socials: [
                              ...school.socials.slice(0, i),
                              { ...s, link },
                              ...school.socials.slice(i + 1),
                            ],
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
              <Btn
                text="Add social"
                onclick={() =>
                  setSchool({
                    ...school,
                    socials: [...school.socials, { name: "", link: "" }],
                  })
                }
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

export default SchoolInfo;
