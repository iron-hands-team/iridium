import type { Metadata } from "next";
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

function Page() {
  return (
    <div>
      <QuizBody />
    </div>
  );
}

export default Page;
