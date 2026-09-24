import type { PostType } from "@/lib/schemas";

function Announcement({ announcement }: { announcement: PostType }) {
  return (
    <div className="border-1 border-zinc-800 p-4 flex flex-col gap-y-2">
      <div className="flex gap-x-5 items-center">
        <h2 className="text-lg font-bold">{announcement.title}</h2>
        {announcement.created_at && (
          <div
            className="text-xs text-black dark:text-zinc-300"
            title={announcement.created_at}
          >
            {new Date(announcement.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <p className="text-sm text-black! dark:text-zinc-300!">
        {announcement.content}
      </p>
    </div>
  );
}

export default Announcement;
