import { redirect } from "next/navigation";
import type { MessageResponse, MessageType } from "@/types/message";
import type { UserResponse, UserType } from "@/types/user";
import { getSession } from "@/lib/auth";
import { parseUser } from "@/lib/helpers";
import Messages from "./messages";

function parseMessage(m: MessageResponse): MessageType {
  return {
    id: m.id,
    subject: m.subject,
    body: m.body,
    createdAt: m.created_at,
    read: m.read,
    sender: parseUser(m.sender),
    recipient: parseUser(m.recipient),
  };
}

async function Page() {
  const { user, cookie } = await getSession();
  if (!user) redirect("/");

  const [inboxRaw, sentRaw, staffRaw] = await Promise.all([
    fetch(`${process.env.INTERNAL_API_URL}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }).then((res) => res.json()),
    fetch(`${process.env.INTERNAL_API_URL}/messages/sent`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }).then((res) => res.json()),
    fetch(`${process.env.INTERNAL_API_URL}/users/staff`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }).then((res) => res.json()),
  ]);

  const inbox: MessageType[] = inboxRaw.map(parseMessage);
  const sent: MessageType[] = sentRaw.map(parseMessage);
  const recipients: UserType[] = staffRaw
    .map((u: UserResponse) => parseUser(u))
    .filter((u: UserType) => u.username !== user.username);

  return (
    <div className="px-50 py-10 flex flex-col gap-y-10">
      <h2 className="text-xl font-bold">Messages</h2>
      <Messages inbox={inbox} sent={sent} recipients={recipients} />
    </div>
  );
}

export default Page;