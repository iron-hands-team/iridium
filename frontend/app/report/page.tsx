import { FaExclamationCircle } from "react-icons/fa";
import Report from "./report";

function Page() {
  return (
    <div className="px-50 flex py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto pb-10">
      <div className="flex-1 flex flex-col gap-y-5">
        <h2 className="text-xl font-bold flex items-center gap-x-3">
          <FaExclamationCircle size={18} /> Report
        </h2>
        <Report />
      </div>
    </div>
  );
}

export default Page;
