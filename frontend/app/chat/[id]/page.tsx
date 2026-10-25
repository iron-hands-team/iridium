import type { ChannelType } from "@/lib/schemas";
import type { MessageType as MessageT, ReactionType } from "@/types/chat";
import type { UserResponse } from "@/types/user";
import { getSession } from "@/lib/auth";
import { parseUser } from "@/lib/helpers";
import { notFound } from "next/navigation";
import ChannelSidebar from "../channel-sidebar";
import Messages from "@/components/chat/messages";

//TODO: async metadata

type MessageType = MessageT & {
  user: UserResponse;
  created_at: string;
  replying_to?: number;
  reaction_list: ReactionType[];
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
            reactions: m.reaction_list,
          };
        })
      : [];

  return (
    <div className="flex px-3 sm:px-10 lg:px-50 max-w-450 mx-auto">
      <ChannelSidebar
        channels={channel}
        clubChannels={clubChannels}
        selectedId={id}
        showNewChannelBtn={user.role === "admin"}
      />
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
