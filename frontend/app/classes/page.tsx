import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ClassBody from "@/components/layout/Class";

async function Page() {
  const { user } = await getSession();
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    redirect("/");
  }

  return <ClassBody />;
}

export default Page;