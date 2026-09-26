import { FaBasketball } from "react-icons/fa6";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function Page() {
  const { user } = await getSession();
  if (user.role !== "admin") redirect("/");

  return (
    <div className="px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBasketball size={18} /> View clubs
      </h2>
    </div>
  );
}

export default Page;
