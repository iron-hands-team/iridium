import type { RuleType } from "@/lib/schemas";
import { FaBook } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import NewRule from "@/components/admin/new-rule";
import Rules from "./rules";

async function Page() {
  const { user, cookie } = await getSession();
  const ruleData: RuleType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/rules`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());
  const rules = ruleData.map((r, i) => {
    return { ...r, id: i + 1 };
  });

  return (
    <div className="px-50 flex py-10 gap-x-15 h-[calc(100vh-53px)] overflow-y-auto pb-10">
      <div className="flex-1 flex flex-col gap-y-5">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold flex items-center gap-x-3">
            <FaBook size={18} /> Rules
          </h2>
          {user.role === "admin" && (
            <NewRule text="Edit rules" existing={rules} primary />
          )}
        </div>
        <Rules rules={rules} />
      </div>
    </div>
  );
}

export default Page;
