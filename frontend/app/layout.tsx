import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSession } from "@/lib/auth";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import "./globals.css";
import LoginForm from "@/components/auth/login-form";

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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {session.user ? (
          <>
            <Nav />
            {children}
            <Footer />
          </>
        ) : (
          <LoginForm />
        )}
      </body>
    </html>
  );
}
