import type { ChannelType } from "@/app/chat/page";
import { FaHashtag } from "react-icons/fa";
import ChannelMenu from "./channel-menu";
import Link from "next/link";

interface ChannelProps {
  channel: ChannelType;
  selected?: boolean;
  admin?: boolean;
}

function Channel({ channel, selected, admin }: ChannelProps) {
  return (
    <div
      className={`hover:bg-zinc-300/50 dark:hover:bg-zinc-900/50 flex items-center text-zinc-700 dark:text-zinc-300 group relative ${selected && "font-bold bg-zinc-300 dark:bg-zinc-900"}`}
    >
      <Link
        href={`/chat/${channel.id}`}
        className="w-full px-4 py-2 flex items-center gap-x-2"
      >
        <FaHashtag size={15} />
        {channel.name}
      </Link>
      {admin && <ChannelMenu channel={channel} />}
    </div>
  );
}

export default Channel;
