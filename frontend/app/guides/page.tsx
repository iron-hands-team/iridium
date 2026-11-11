import type { GuideType } from "@/lib/schemas";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { FaBookOpen } from "react-icons/fa";
import Guides from "./guides";
import Btn from "@/components/ui/btn";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "View detailed guides, tips, and additional information about using Iridium for your school on this page!",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Guides",
    description:
      "View detailed guides, tips, and additional information about using Iridium for your school!",
    url: "https://iridium.tonymac.net/guides",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { user, cookie } = await getSession();
  const guides: GuideType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/guides`,
    {
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-4 sm:px-10 lg:px-50 flex py-10 pb-10 flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBookOpen size={18} /> Guides
      </h2>
      {user.role === "admin" && (
        <Btn text="Edit guides" link="/admin/guides" styles="w-fit" primary />
      )}
      <Guides guides={guides} />
    </div>
  );
}

export default Page;
