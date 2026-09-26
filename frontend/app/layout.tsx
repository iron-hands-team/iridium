import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSession } from "@/lib/auth";
import { ThemeProvider } from "next-themes";
import LoginForm from "@/components/auth/login-form";
import Nav from "@/components/layout/nav";
import "./globals.css";
import Page from "@/app/page";
import DashboardBody from "@/components/layout/DashboardBody";
import ClubBody from "@/components/layout/ClubTeacher";
import ClassBody from "@/components/layout/ClassTeacher";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Home | Iridium",
  description: "Welcome to Iridium!",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class">
          {session.user ? (
            <>
              <Nav />
              {children}
            </>
          ) : (
            <LoginForm />
          )}
        </ThemeProvider>
      </body>
    </html>
    
  );
}
