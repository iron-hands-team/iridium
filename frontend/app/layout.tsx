import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSession } from "@/lib/auth";
import { ThemeProvider } from "next-themes";
import LoginForm from "@/components/auth/login-form";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import "./globals.css";

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
              <Footer />
            </>
          ) : (
            <LoginForm />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
