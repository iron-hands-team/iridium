import type { ChannelType } from "./page";
import Channel from "@/components/chat/channel";
import ChannelBtn from "@/components/chat/channel-btn";

interface ChannelSidebarProps {
  channels: ChannelType[];
  clubChannels: ChannelType[];
  selectedId?: number;
  showNewChannelBtn: boolean;
}

function ChannelSidebar({
  channels,
  clubChannels,
  selectedId,
  showNewChannelBtn,
}: ChannelSidebarProps) {
  return (
    <div className="w-60 py-3 pr-5 border-r border-zinc-800 flex flex-col gap-y-3 h-[calc(100vh-57px)] overflow-auto">
      <h2 className="font-bold text-lg px-4 my-2">Channels</h2>
      {channels.length > 0 ? (
        channels.map((c) => (
          <Channel
            key={c.id}
            channel={c}
            selected={selectedId == c.id}
            admin={showNewChannelBtn}
          />
        ))
      ) : (
        <div className="text-sm text-center text-zinc-700 dark:text-zinc-300 py-5">
          No channels yet
        </div>
      )}
      {clubChannels.length > 0 && (
        <>
          <h2 className="font-bold text-lg px-4 my-2">Club chats</h2>
          {clubChannels.map((c) => (
            <Channel
              key={c.id}
              channel={c}
              selected={selectedId == c.id}
              admin={showNewChannelBtn}
            />
          ))}
        </>
      )}
      {showNewChannelBtn && <ChannelBtn />}
    </div>
  );
}

export default ChannelSidebar;
