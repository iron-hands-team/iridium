import type { FileType } from "@/lib/schemas";
import { getSession } from "@/lib/auth";
import { FaFile } from "react-icons/fa";
import Files from "./files";

async function Page() {
  const { user, cookie } = await getSession();
  const files: FileType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/files`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-50 py-10 flex flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaFile size={18} /> Files
      </h2>
      <Files files={files} isAdmin={user.role === "admin"} />
    </div>
  );
}

export default Page;
