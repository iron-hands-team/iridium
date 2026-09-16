"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";

interface InputProps {
  placeholder: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}

function Input({ placeholder, value, setValue, type }: InputProps) {
  const [viewing, setViewing] = useState<boolean>(false);

  function handleView() {
    setViewing(!viewing);
    if (!viewing) {
      setTimeout(() => {
        setViewing(false);
      }, 3000);
    }
  }

  return (
    <div className="relative flex items-center">
      <input
        type={viewing ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-zinc-200 dark:bg-zinc-900 px-3 py-1.5 text-black dark:text-zinc-300 outline-none text-base"
      />
      {type === "password" && value.length > 0 && (
        <FaEye
          size={18}
          onClick={handleView}
          className="absolute right-3 cursor-pointer"
          title="Toggle password visibility"
        />
      )}
    </div>
  );
}

export default Input;
