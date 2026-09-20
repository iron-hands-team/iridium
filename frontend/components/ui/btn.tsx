"use client";

interface ButtonProps {
  text: string;
  onclick?: () => void;
  primary?: boolean;
}

function Btn({ text, onclick, primary }: ButtonProps) {
  const btnStyles = `${primary ? "bg-zinc-950 dark:bg-zinc-300 hover:bg-zinc-900 dark:hover:bg-zinc-300/85 text-zinc-300 dark:text-zinc-950" : "hover:bg-zinc-300/85 dark:hover:bg-zinc-900/50"} border-1 border-zinc-800 py-2 cursor-pointer w-full font-bold text-white font-sans`;

  return (
    <button className={btnStyles} onClick={onclick}>
      {text}
    </button>
  );
}

export default Btn;
