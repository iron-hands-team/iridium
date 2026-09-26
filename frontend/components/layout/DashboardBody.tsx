"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";

interface Test {
  id: number;
  name: string;
  text: string;
}

export default function DashboardBody() {
  const [test, setTest] = useState<Test[]>([]);

  // i had to use ai for the functions cuz i dont know how to use
  function addTest() {
    setTest((prev) => [
      ...prev,
      {
        id: prev.length,
        name: "",
        text: "",
      },
    ]);
  }

  function deleteTest(index: number) {
    setTest((prev) => prev.filter((_, i) => i !== index));
  }

  function updateText(index: number, text: string) {
    setTest((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text: text } : item)),
    );
  }

  function updateName(index: number, text: string) {
    setTest((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: text } : item)),
    );
  }

  return (
    <div className="bg-[#131313]">
      <div
        style={{
          display: "flex",
          gap: "20px",
          height: "70px",
          alignItems: "center",
          padding: 10,
          borderTop: "1px solid gray",
          borderBottom: "1px solid gray",
        }}
      >
        <Btn text="Add Section" onclick={addTest} />

        <Btn
          text="Delete Section"
          onclick={() => deleteTest(test.length - 1)}
        />
      </div>

      <div
        style={{
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          padding: 10,
        }}
      >
        {test.map((item, i) => (
          <div
            key={item.id}
            style={{
              width: "80%",
              padding: "15px",
              border: "1px solid lightgray",
              borderRadius: "8px",
            }}
          >
            <p>#{item.id}</p>

            <p>{item.name == "" ? "Student's Name" : item.name}</p>

            <textarea
              placeholder="Enter name"
              value={item.name}
              onChange={(e) => updateName(i, e.target.value)}
              className="text-white dark:text-zinc-300 text-sm w-full resize-none h-24 bg-[#333333] p-2"
            />

            <p>Information:</p>

            <textarea
              placeholder="Dih"
              value={item.text}
              onChange={(e) => updateText(i, e.target.value)}
              className="text-white dark:text-zinc-300 text-sm w-full resize-none h-24 bg-[#333333] p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
