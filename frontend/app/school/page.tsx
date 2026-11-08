import type { Metadata } from "next";
import type { SchoolType } from "@/lib/schemas";
import { FaEnvelope, FaLink, FaPhoneAlt, FaSchool } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { schoolUrl } from "@/lib/helpers";
import { getSession } from "@/lib/auth";
import Btn from "@/components/ui/btn";
import Image from "next/image";

export const metadata: Metadata = {
  title: "School Information",
  description:
    "View your school's detailed information, contact methods, branding assets, and social links on this page!",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "School Information",
    description:
      "View your school's detailed information, contact methods, branding assets, and social links on this page!",
    url: "https://iridium.tonymac.net/school",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { user, cookie } = await getSession();
  const school: SchoolType = await fetch(
    `${process.env.INTERNAL_API_URL}/school`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());
  console.log(school);

  return (
    <div className="px-50 py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto pb-10 flex flex-col gap-y-10">
      <Image
        src={schoolUrl("banner")}
        alt="School banner"
        width={1000}
        height={1000}
        unoptimized
        className="w-full h-100"
      />
      <div className="flex flex-col gap-y-5">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          <FaSchool size={18} /> School
        </h2>
      </div>
      {user.role === "admin" && (
        <Btn link="/admin" text="Edit" styles="w-fit" primary />
      )}
      <div className="flex gap-x-15">
        <Image
          src={schoolUrl("logo")}
          alt="School logo"
          width={200}
          height={200}
          className="w-50 h-50"
          unoptimized
        />
        <div className="flex flex-col gap-y-3 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-black dark:text-white text-xl font-bold">
            {school.title}
          </h2>
          {school.description && <p>{school.description}</p>}
          {school.address && (
            <p className="flex items-center gap-x-2">
              <FaLocationPin size={15} /> {school.address}
            </p>
          )}
          {school.email && (
            <a
              className="flex items-center gap-x-2"
              href={`mailto:${school.email}`}
              target="_blank"
            >
              <FaEnvelope size={15} /> {school.email}
            </a>
          )}
          {school.number && (
            <a
              className="flex items-center gap-x-2"
              href={`tel:${school.number}`}
            >
              <FaPhoneAlt size={15} /> {school.number}
            </a>
          )}
          {school.socials && (
            <>
              <h2 className="flex items-center gap-x-3 font-bold text-lg text-black dark:text-white">
                <FaLink size={15} /> Social links
              </h2>
              <div className="flex flex-col gap-y-3">
                {school.socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    className="hover:underline w-fit"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
