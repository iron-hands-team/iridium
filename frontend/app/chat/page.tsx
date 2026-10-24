import type { Metadata } from "next";
import ChannelBtn from "@/components/chat/channel-btn";

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

//TODO: make this page actually show something and add channel management (edit, delete, etc.)

function Page() {
  return <ChannelBtn />;
}

export default Page;
