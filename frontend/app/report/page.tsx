import type { Metadata } from "next";
import { FaExclamationCircle } from "react-icons/fa";
import Report from "./report";

export const metadata: Metadata = {
  title: "Submit Report",
  description:
    "Create and submit custom reports about your classes, school, or Iridium to admins and teachers here.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Submit Report",
    description:
      "Create and submit custom reports about your classes, school, or Iridium to admins and teachers here.",
    url: "https://iridium.tonymac.net/report",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

function Page() {
  return (
    <div className="px-50 flex py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto pb-10">
      <div className="flex-1 flex flex-col gap-y-5">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          <FaExclamationCircle size={18} /> Report
        </h2>
        <Report />
      </div>
    </div>
  );
}

export default Page;
