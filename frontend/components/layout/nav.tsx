import { getSession } from "@/lib/auth";
import NavUser from "./nav-user";
import Link from "next/link";
import Image from "next/image";

async function Nav() {
  const session = await getSession();

  return (
    <div className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-950">
      <nav className="border-b-1 border-zinc-800 flex items-center gap-x-5 py-2 px-50 relative">
        <Link
          href="/"
          className="text-xl font-bold text-black dark:text-white mr-5 flex items-center gap-x-3"
        >
          <Image
            src="/logo.png"
            alt="Iridium Logo"
            width={27}
            height={27}
            className="invert-100 dark:invert-0"
          />
          Iridium
        </Link>
        {session.user.isAdmin && (
          <Link href="/admin" className="px-3 py-1.5">
            Manage
          </Link>
        )}
        <Link href="/calendar" className="px-3 py-1.5">
          Calendar
        </Link>
        <Link href="/clubs" className="px-3 py-1.5">
          Clubs
        </Link>
        <NavUser user={session.user} />
      </nav>
    </div>
  );
}

export default Nav;
