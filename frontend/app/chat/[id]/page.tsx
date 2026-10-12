import type { ChannelType } from "@/lib/schemas";
import { getSession } from "@/lib/auth";
import Channel from "@/components/chat/channel";
import ChannelBtn from "@/components/chat/channel-btn";

async function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const { user, cookie } = await getSession();
  const channelData: ChannelType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/chat/channels`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    },
  ).then((res) => res.json());
  const channels =
    channelData.length > 0 ? channelData.filter((c) => !c.club) : [];
  const clubChannels =
    channelData.length > 0 ? channelData.filter((c) => c.club) : [];

  return (
    <div className="flex gap-x-20 px-3 sm:px-10 lg:px-50 max-w-450 mx-auto">
      <div className="w-60 py-3 pr-5 border-r border-zinc-800 flex flex-col gap-y-3 h-[calc(100vh-57px)] overflow-auto">
        <h2 className="font-bold text-lg px-4 my-2">Channels</h2>
        {channels.map((c) => (
          <Channel key={c.id} channel={c} selected={id == c.id} />
        ))}
        <h2 className="font-bold text-lg px-4 my-2">Clubs</h2>
        {clubChannels.map((c) => (
          <Channel key={c.id} channel={c} selected={id == c.id} />
        ))}
        {user.role === "admin" && <ChannelBtn />}
      </div>
      <div className="flex-1 flex flex-col gap-y-10 justify-center items-center">
        <h1 className="font-bold text-lg">Real time chat coming soon!</h1>
        <div>Channel ID {id}</div>
      </div>
    </div>
  );
}

export default Page;
