import type { UserType } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import Users from "./users";

const users: UserType[] = [
  { id: "kddDfe834J", lastName: "Carroll", firstName: "Ronnie" },
  {
    id: "sadfdsaffsd",
    lastName: "Dickson",
    firstName: "Haris",
    middleName: "Martha",
  },
  { id: "rjstsega", lastName: "Cantu", firstName: "Eileen" },
  { id: "3hdfnshn", lastName: "Black", firstName: "Lester", isAdmin: true },
  {
    id: "dxfmerth",
    lastName: "Field",
    firstName: "Savannah",
    middleName: "Betsy",
  },
  {
    id: "cxn45jtsr",
    lastName: "Morton",
    firstName: "Roshan",
    middleName: "Cordelia",
  },
  { id: "st45b6rrsb", lastName: "Hodge", firstName: "Cohen" },
  {
    id: "fgk5ksb",
    lastName: "Buckley",
    firstName: "Evelyn",
    middleName: "Victoria",
    isAdmin: true,
  },
  { id: "sadfasdhgawegf", lastName: "Harding", firstName: "Maddie" },
  { id: "asdgfwae4gds", lastName: "Gray", firstName: "Aqsa" },
  {
    id: "sadh3w4hrn",
    lastName: "Orr",
    firstName: "Wesley",
    middleName: "Prince",
  },
  { id: "w34hrsadf", lastName: "Mcgowan", firstName: "Antony" },
];

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = params.t;
  if (type !== "s" && type !== "t") redirect("/admin");

  return (
    <div className="px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaUsers size={18} /> View users
      </h2>
      <Users users={users} />
    </div>
  );
}

export default Page;
