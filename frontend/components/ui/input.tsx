"use client";

import { useState, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface InputProps {
  placeholder?: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
  styles?: string;
  clear?: boolean;
}

function Input({
  placeholder,
  value,
  setValue,
  type,
  styles,
  clear,
}: InputProps) {
  const [viewing, setViewing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleView() {
    setViewing(!viewing);
    if (!viewing) {
      setTimeout(() => {
        setViewing(false);
      }, 3000);
    }
  }

  function handleClear() {
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative flex items-center">
      <input
        type={viewing ? "text" : type}
        placeholder={placeholder}
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full bg-zinc-200 dark:bg-zinc-900 px-3 py-1.5 text-black dark:text-zinc-300 outline-none text-base ${styles}`}
      />
      <div className="absolute right-3 flex gap-x-3">
        {type === "password" && value.length > 0 && (
          <FaEye
            size={18}
            onClick={handleView}
            className="cursor-pointer"
            title="Toggle password visibility"
          />
        )}
        {value.length > 0 && clear && (
          <FaXmark
            size={18}
            onClick={handleClear}
            className="cursor-pointer"
            title="Clear input field"
          />
        )}
      </div>
    </div>
  );
}

export default Input;
