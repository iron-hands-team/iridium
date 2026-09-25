"use client";

import Link from "next/link";

interface ButtonProps {
  text: string;
  link?: string;
  onclick?: () => void;
  styles?: string;
  primary?: boolean;
}

function Btn({ text, link, onclick, styles, primary }: ButtonProps) {
  const btnStyles =
    `${primary ? "border-zinc-950 dark:border-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-300/30 bg-zinc-950 dark:bg-zinc-300 hover:bg-zinc-900 dark:hover:bg-zinc-300/85 text-zinc-300 dark:text-zinc-950" : "hover:bg-zinc-200/85 dark:hover:bg-zinc-900/50"} border-1 border-zinc-800 py-2 cursor-pointer font-bold text-center px-4 ` +
    styles;

  return link ? (
    <Link href={link} className={btnStyles}>
      {text}
    </Link>
  ) : (
    <button className={btnStyles} onClick={onclick}>
      {text}
    </button>
  );
}

export default Btn;
