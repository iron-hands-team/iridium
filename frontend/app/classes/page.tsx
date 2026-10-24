import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ClassBody from "@/components/layout/ClassTeacher";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "View all your currently enrolled classes, access class assignments and resources, and browse class information.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Classes",
    description:
      "View all your currently enrolled classes, access class assignments and resources, and browse class information.",
    url: "https://iridium.tonymac.net/classes",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { user } = await getSession();
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    redirect("/");
  }

  return <ClassBody />;
}

export default Page;
