import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { FaQuestionCircle } from "react-icons/fa";
import QuizBody from "@/components/class/quizPopupTeacher";

export const metadata: Metadata = {
  title: "Quizzes",
  description:
    "Create quizzes for students or view your assigned quizzes for class on this page!",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Quizzes",
    description:
      "Create quizzes for students or view your assigned quizzes for class on this page!",
    url: "https://iridium.tonymac.net/quizzes",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

async function Page() {
  const { cookie } = await getSession();
  const quizzes: object[] = await fetch(
    `${process.env.INTERNAL_API_URL}/classes/quizzes`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-4 sm:px-10 lg:px-50 flex py-10 pb-10 flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaQuestionCircle size={18} /> Quizzes
      </h2>
      <QuizBody existing={quizzes} />
    </div>
  );
}

export default Page;

//TODO: add page for student facing quizzes
