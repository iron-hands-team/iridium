import type { ChannelType } from "@/lib/schemas";
import { FaHashtag } from "react-icons/fa";
import Link from "next/link";

interface ChannelProps {
  channel: ChannelType;
  selected?: boolean;
}

function Channel({ channel, selected }: ChannelProps) {
  return (
    <Link
      href={`/chat/${channel.id}`}
      className={`hover:bg-zinc-300/50 dark:hover:bg-zinc-900/50 flex px-4 py-1.5 items-center gap-x-2 text-zinc-700 dark:text-zinc-300 ${selected && "font-bold bg-zinc-300 dark:bg-zinc-900"}`}
    >
      <FaHashtag size={15} />
      {channel.name}
    </Link>
  );
}

export default Channel;
