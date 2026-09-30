"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateProps {
  date: Date | null;
  setDate: (d: Date | null) => void;
}

function Date({ date, setDate }: DateProps) {
  return (
    <DatePicker
      selected={date}
      onChange={(d: Date | null) => setDate(d)}
      className="outline-none bg-zinc-200 dark:bg-zinc-900 cursor-pointer py-2 px-4 caret-transparent text-sm w-35"
    />
  );
}

export default Date;
