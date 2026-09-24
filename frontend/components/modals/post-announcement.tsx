"use client";

import { postSchema, type PostType } from "@/lib/schemas";
import { useState } from "react";
import { roles } from "@/lib/constants";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Btn from "../ui/btn";
import Textarea from "../ui/textarea";
import Dropdown from "../ui/dropdown";

const labelStyles =
  "text-sm text-black dark:text-zinc-300 flex flex-col gap-y-1";

interface PostAnnouncementModalProps {
  closeModal: () => void;
  refresh: () => void;
}

function PostAnnouncementModal({
  closeModal,
  refresh,
}: PostAnnouncementModalProps) {
  const [post, setPost] = useState<PostType>({
    title: "",
    content: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handlePost() {
    const validated = postSchema.safeParse(post);
    if (validated.success) {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: post.title,
          content: post.content,
        }),
      });
      setLoading(false);
      if (res.ok) {
        refresh();
        closeModal();
      } else {
        setError("Something went wrong, please try again");
      }
    } else {
      setError(validated.error.issues[0].message);
    }
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">Post announcement</h2>
        <div className="flex flex-col gap-y-3 text-sm">
          <label className={labelStyles}>
            <div>
              Role <span className="text-red-500">*</span>
            </div>
            <Dropdown
              value={
                post.role ? post.role[0].toUpperCase() + post.role.slice(1) : ""
              }
              setValue={(role) =>
                setPost({ ...post, role: role.toLowerCase() })
              }
              values={[
                "All",
                ...roles.map((r) => r[0].toUpperCase() + r.slice(1)),
              ]}
            />
          </label>
          <label className={labelStyles}>
            <div>
              Title <span className="text-red-500">*</span>
            </div>
            <Input
              placeholder="School Day Schedule Changes"
              value={post.title}
              setValue={(title) => setPost({ ...post, title })}
            />
          </label>
          <label className={labelStyles}>
            <div>
              Content <span className="text-red-500">*</span>
            </div>
            <Textarea
              placeholder="Because of the recent snow days and weather events, we have decided to..."
              value={post.content}
              setValue={(content) => setPost({ ...post, content })}
            />
          </label>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex gap-x-3">
          <Btn
            text={loading ? "Submitting..." : "Submit"}
            onclick={handlePost}
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}

export default PostAnnouncementModal;
