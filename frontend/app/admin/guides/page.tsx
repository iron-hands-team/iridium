import type { Metadata } from "next";
import type { GuideType } from "@/lib/schemas";
import { FaBookOpen } from "react-icons/fa";
import Guides from "./guides";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Manage Guides",
  description:
    "Create, edit, and browse different guides about managing Iridium and using different features for your school.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Manage Guides",
    description:
      "Create, edit, and browse different guides about managing Iridium and using different features for your school.",
    url: "https://iridium.tonymac.net/admin/guides",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { cookie } = await getSession();
  const guides: GuideType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/guides`,
    {
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-4 sm:px-10 lg:px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBookOpen size={18} /> Manage guides
      </h2>
      <Guides guides={guides} />
    </div>
  );
}

export default Page;
