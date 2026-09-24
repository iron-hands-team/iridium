"use client";

interface TextareProps {
  placeholder: string;
  value: string;
  setValue: (v: string) => void;
  styles?: string;
}

function Textarea({ placeholder, value, setValue, styles }: TextareProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`w-full bg-zinc-200 dark:bg-zinc-900 px-3 py-1.5 text-black dark:text-zinc-300 outline-none min-h-25 resize-y ${styles}`}
    ></textarea>
  );
}

export default Textarea;
