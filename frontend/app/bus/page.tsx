import Buses from "@/components/bus/buses";
import type { Metadata } from "next";
import { FaBus } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Bus",
  description:
    "Check your buses, routes and schedules, as well as all the different stops on this page.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Bus",
    description:
      "Check your buses, routes and schedules, as well as all the different stops on this page.",
    url: "https://iridium.tonymac.net/bus",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

function Page() {
  return (
    <div className="px-4 sm:px-10 lg:px-50 flex py-10 pb-10 flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBus size={18} /> Bus
      </h2>
      <Buses />
    </div>
  );
}

export default Page;
