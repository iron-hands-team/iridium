import type { Metadata } from "next";
import type { FileType } from "@/lib/schemas";
import { getSession } from "@/lib/auth";
import { FaFile } from "react-icons/fa";
import Files from "./files";

export const metadata: Metadata = {
  title: "Files",
  description:
    "Browse and download all the images, videos, documents, PDFs, or other files uploaded by your school here.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Files",
    description:
      "Browse and download all the images, videos, documents, PDFs, or other files uploaded by your school here.",
    url: "https://iridium.tonymac.net/files",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { user, cookie } = await getSession();
  const files: FileType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/files`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-50 py-10 flex flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaFile size={18} /> Files
      </h2>
      <Files files={files} isAdmin={user.role === "admin"} />
    </div>
  );
}

export default Page;
