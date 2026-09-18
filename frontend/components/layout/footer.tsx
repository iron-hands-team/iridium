import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <footer
      className="border-t-1 border-zinc-800 flex flex-col items-center gap-y-5 py-10 text-sm text-zinc-700
     dark:text-zinc-300"
    >
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Iridium Logo"
          width={40}
          height={40}
          className="mb-5"
        />
      </Link>
      <div>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/iron-hands-team/iridium"
          target="_blank"
          className="hover:underline"
        >
          Iridium
        </a>
      </div>
      <div className="flex gap-x-10">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/calendar" className="hover:underline">
          Calendar
        </Link>
        <Link href="/clubs" className="hover:underline">
          Clubs
        </Link>
        <Link href="/profile" className="hover:underline">
          Profile
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
