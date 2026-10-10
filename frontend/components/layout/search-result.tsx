import Link from "next/link";

interface SearchResultProps {
  children: React.ReactNode;
  href: string;
  name: string;
  description?: string;
}

function SearchResult({
  children,
  href,
  name,
  description,
}: SearchResultProps) {
  return (
    <Link
      href={href}
      className="flex items-center hover:bg-zinc-200 dark:hover:bg-zinc-950 px-4 py-2 gap-x-4"
    >
      {children}
      <div className="flex-1 text-left">
        <h2 className="font-bold text-black dark:text-white mb-0.5">{name}</h2>
        {description && (
          <p className="text-xs text-zinc-700! dark:text-zinc-300!">
            {description.slice(0, 100) +
              (description.length > 100 ? "..." : "")}
          </p>
        )}
      </div>
    </Link>
  );
}

export default SearchResult;
