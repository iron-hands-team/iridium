import { FaBell, FaBullhorn, FaCalendar, FaLink } from "react-icons/fa";

const headingStyles = "text-xl font-bold flex items-center gap-x-3";

function Page() {
  return (
    <div className="px-50 flex py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto">
      <div className="flex-1 flex flex-col gap-y-5">
        <h2 className={headingStyles}>
          <FaBullhorn size={18} /> Announcements
        </h2>
        {/* <div className="border-1 border-zinc-800 px-4 py-2">
          <h2>Test announcement 1</h2>
        </div> */}
        <div className="pt-5 pb-10 text-sm text-center text-zinc-700 dark:text-zinc-300">
          That&apos;s all the announcements!
        </div>
      </div>
      {/* <div className="flex flex-col gap-y-5 w-70 sticky top-0">
        <h2 className={headingStyles}>
          <FaBell size={18} /> Schedule
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2">
          <h2>Schedule</h2>
        </div>
        <h2 className={headingStyles}>
          <FaCalendar size={18} /> Calendar
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2">
          <h2>Events</h2>
        </div>
        <h2 className={headingStyles}>
          <FaLink size={18} /> Links
        </h2>
        <div className="border-1 border-zinc-800 px-4 py-2">
          <h2>Links</h2>
        </div>
      </div> */}
    </div>
  );
}

export default Page;
