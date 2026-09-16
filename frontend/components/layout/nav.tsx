import NavTheme from "./nav-theme";
import Link from "next/link";

function Nav() {
  return (
    <nav className="border-b-1 border-zinc-800 flex items-center gap-x-5 py-3 px-50 relative">
      <Link href="/" className="text-xl font-bold text-black dark:text-white">
        Iridium
      </Link>
      <NavTheme />
    </nav>
  );
}

export default Nav;
