"use client";

import { FaCheck } from "react-icons/fa";

interface CheckboxProps {
  text: string;
  checked: boolean;
  setChecked: (c: boolean) => void;
}

function Checkbox({ text, checked, setChecked }: CheckboxProps) {
  return (
    <label className="flex items-center gap-x-2 cursor-pointer w-fit text-zinc-700 dark:text-zinc-300">
      <div
        className={`border-2 border-zinc-800 w-4 h-4 flex items-center justify-center relative ${checked && "bg-zinc-800"}`}
      >
        <FaCheck
          size={15}
          className={`${checked ? "opacity-100" : "opacity-0"} absolute transition-opacity! text-white`}
        />
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="hidden"
      />
      {text}
    </label>
  );
}

export default Checkbox;
