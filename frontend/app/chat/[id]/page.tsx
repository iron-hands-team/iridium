import type { ChannelType } from "@/lib/schemas";
import type { MessageType as MessageT } from "@/types/chat";
import type { UserResponse } from "@/types/user";
import { getSession } from "@/lib/auth";
import { parseUser } from "@/lib/helpers";
import { notFound } from "next/navigation";
import Channel from "@/components/chat/channel";
import ChannelBtn from "@/components/chat/channel-btn";
import Messages from "@/components/chat/messages";

type MessageType = MessageT & {
  user: UserResponse;
  created_at: string;
  replying_to?: number;
};

async function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const { user, cookie } = await getSession();
  const channelData = await fetch(
    `${process.env.INTERNAL_API_URL}/chat/channels`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    },
  ).then((res) => res.json());
  const foundChannel = channelData.find((c: ChannelType) => c.id == id);
  const channel = foundChannel
    ? {
        ...foundChannel,
        club: foundChannel.club?.id,
        clubName: foundChannel.club?.name,
      }
    : undefined;
  const channels: ChannelType[] =
    channelData.length > 0
      ? channelData.filter((c: ChannelType) => !c.club)
      : [];
  if (!channel) notFound();
  const clubChannels: ChannelType[] =
    channelData.length > 0
      ? channelData.filter((c: ChannelType) => c.club)
      : [];
  const channelMessage: MessageType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/chat/channel/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    },
  ).then((res) => res.json());
  const channelMessages =
    channelMessage.length > 0
      ? channelMessage.map((m) => {
          const reply = m.replying_to
            ? channelMessage.find((c) => c.id === m.replying_to)
            : undefined;
          return {
            ...m,
            user: parseUser(m.user),
            createdAt: new Date(m.created_at),
            replyingTo: m.replying_to
              ? {
                  id: m.replying_to,
                  text: reply?.text || "Message deleted",
                  deleted: !reply,
                }
              : undefined,
          };
        })
      : [];

  return (
    <div className="flex px-3 sm:px-10 lg:px-50 max-w-450 mx-auto">
      <div className="w-60 py-3 pr-5 border-r border-zinc-800 flex flex-col gap-y-3 h-[calc(100vh-57px)] overflow-auto">
        <h2 className="font-bold text-lg px-4 my-2">Channels</h2>
        {channels.length > 0 ? (
          channels.map((c) => (
            <Channel key={c.id} channel={c} selected={id == c.id} />
          ))
        ) : (
          <div className="text-sm text-center text-zinc-700 dark:text-zinc-300 py-5">
            No channels yet
          </div>
        )}
        {clubChannels.length > 0 && (
          <>
            <h2 className="font-bold text-lg px-4 my-2">Clubs</h2>
            {clubChannels.map((c) => (
              <Channel key={c.id} channel={c} selected={id == c.id} />
            ))}
          </>
        )}
        {user.role === "admin" && <ChannelBtn />}
      </div>
      <Messages
        channel={channel}
        messages={channelMessages}
        id={id.toString()}
        userId={user.id!}
        admin={user.role === "admin"}
      />
    </div>
  );
}

export default Page;
