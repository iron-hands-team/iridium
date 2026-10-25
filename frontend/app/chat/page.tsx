import type { Metadata } from "next";
import type { ChannelType } from "@/lib/schemas";
import ChannelSidebar from "./channel-sidebar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Browse messages from different general school channels or club-specific channels and engage in real-time chats with other users on Iridium.",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Chat",
    description:
      "Browse messages from different general school channels or club-specific channels and engage in real-time chats with other users on Iridium.",
    url: "https://iridium.tonymac.net/chat",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};


async function Page() {
  const {user, cookie} = await getSession();
  const channelData = await fetch(
    `${process.env.INTERNAL_API_URL}/chat/channels`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    },
  ).then((res)=>res.json())

  const channels: ChannelType[] = 
    channelData.length > 0
      ? channelData.filter((c: ChannelType) => !c.club)
      : [];
  const clubChannels: ChannelType[] = 
    channelData.length > 0
      ? channelData.filter((c: ChannelType)=>c.club)
      : [];
  
  return (
    <div className="flex px-3 sm:px-10 lg:px-50 max-w-450 mx-auto">
      <ChannelSidebar
        channels={channels}
        clubChannels={clubChannels}
        showNewChannelBtn={user.role === "admin"}
      />
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-57px)] text-sm text-zinc-500">
        Select a channel to start chatting
      </div>
    </div>
  );
}


export default Page;
