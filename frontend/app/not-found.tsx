"use client";

import Btn from "@/components/ui/btn";

function Page() {
  return (
    <div className="flex flex-col gap-y-10 py-50 items-center">
      <h1 className="text-black dark:text-white font-extrabold text-9xl">
        404
      </h1>
      <p>Sorry, that page doesn&apos;t exist on Iridium...</p>
      <div className="flex gap-x-5">
        <Btn text="Home" link="/" primary />
        <Btn text="Back" onclick={() => window.history.back()} />
      </div>
    </div>
  );
}

export default Page;
