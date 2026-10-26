import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSession } from "@/lib/auth";
import { ThemeProvider } from "next-themes";
import ToastProvider from "@/components/layout/toast-provider";
import LoginForm from "@/components/auth/login-form";
import Nav from "@/components/layout/nav";

import BodyClassTeacher from "@/classLayout/BodyClassTeacher";
import BusSchool from "@/components/layout/busSchoolBody";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Home | Iridium", template: "%s | Iridium" },
  description:
    "Iridium is an easy to use online platform for schools to post announcements, view schedules, create classes, and manage students and staff.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: { default: "Iridium", template: "%s | Iridium" },
    description:
      "Iridium is an easy to use online platform for schools to post announcements, view schedules, create classes, and manage students and staff.",
    url: "https://iridium.tonymac.net",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};
//TODO: add responsive design and landing/intro page for non logged in users
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { user } = await getSession();

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class">
          {user ? (
            <>
              <Nav />
              {children}
            </>
          ) : (
            <LoginForm />
          )}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
