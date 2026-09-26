"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";


export default function header({headerText}: {headerText : React.ReactElement}) {
 return (
      <header
        style={{
          display: "flex",
					flexDirection: "column",
          gap: "20px",
          height: "150px",
          alignItems: "center",
          padding: 10,
          borderTop: "1px solid gray",
          borderBottom: "1px solid gray",
					justifyContent: "center"
				
        }}
      >
				{headerText}
      </header>
 );
}