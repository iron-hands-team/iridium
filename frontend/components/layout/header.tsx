"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";


export default function header({headerText}: {headerText : React.ReactElement}) {
 return (
      <header
        className="flex flex-col gap-[10px] h-[150px] items-center p-10 border-t-[1px] border-b-[1px] border-gray-500 justify-center w-full bg-purple-400"
      >
				{headerText}
      </header>
 );
}