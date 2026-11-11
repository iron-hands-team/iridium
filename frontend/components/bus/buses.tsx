"use client";

import { useEffect, useState } from "react";
import { bs } from "@/lib/busStore";
import Btn from "@/components/ui/btn";
import { AnimatePresence } from "framer-motion";
import EditBus from "./edit-bus";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";

interface BusesProps {
  isAdmin: boolean;
  existing?: object[];
}

export default function Buses({ isAdmin, existing }: BusesProps) {
  const buses = bs((state) => state.buses);
  const addBus = bs((state) => state.addBus);
  const setBus = bs((state) => state.setBus);
  const setBuses = bs((state) => state.setBuses);
  const clearBuses = bs((state) => state.clearBuses);
  const [index, setIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    console.log(buses);
    const res = await fetch("/api/buses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buses),
    });
    if (res.ok) {
      setError(null);
      toast.success("Buses updated successfully!");
    } else {
      setError("Something went wrong, please try again");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (existing) {
      console.log(existing);
      setBuses(
        existing.map((bus: any) => ({
          id: bus.id,
          name: bus.name,
          desc: bus.description,
          color: bus.color,
          destinations: bus.destinations.map((d) => {
            return {
              ...d,
              beforeSchoolTime: d.before_school_time,
              afterSchoolTime: d.after_school_time,
            };
          }),
          isClicking: false,
        })),
      );
    }
  }, [existing, setBuses]);

  return (
    <>
      <div className="flex flex-col gap-y-3">
        {isAdmin && (
          <div className="flex gap-x-3">
            <Btn
              onclick={() => {
                addBus();
              }}
              text="Add Bus"
              primary
            />
            <Btn
              onclick={() => {
                clearBuses();
              }}
              text="Clear Buses"
            />
          </div>
        )}
        <div className="flex">
          <div className="flex-1 cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3">
            Number
          </div>
          <div className="flex-1 cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3">
            Name
          </div>
          <div className="flex-1 cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3">
            Route
          </div>
          {isAdmin && (
            <div className="flex-1 cursor-pointer font-bold px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-3">
              Settings
            </div>
          )}
        </div>
        {buses.map((busItem, busIndex) => (
          <div
            key={busIndex}
            onClick={() => {
              setBus(busIndex, "isClicking", !busItem.isClicking);
            }}
            className={"w-full flex flex-col items-center justify-center "}
          >
            <div
              className={`w-full flex justify-between transition-all duration-300 ease-in-out overflow-hidden ${
                busItem.isClicking ? "max-h-[500px]" : "max-h-[50px]"
              }`}
            >
              <div className="flex items-center justify-center w-1/4 text-[20px]">
                <p>
                  <b>{busIndex}</b>
                </p>
              </div>
              <div className="w-1/4 flex items-center justify-center ">
                <div
                  className={
                    "h-full w-3/4  flex justify-center items-center p-[10px] " +
                    buses[busIndex].color
                  }
                >
                  <input
                    className="text-black  w-full resize-none h-[50px] p-2   hover:border-zinc-600 text-[18px] font-sans font-bold text-center"
                    placeholder="Bus Name"
                    value={busItem.name}
                    onChange={(e) => {
                      setBus(busIndex, "name", e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start w-1/4 p-[10px] overflow-y-auto gap-[10px]">
                {busItem.isClicking && (
                  <p className="text-[20px]">
                    <b>{busItem.destinations.length} Stops</b>
                  </p>
                )}
                {busItem.isClicking &&
                  busItem.destinations.map(
                    (destinationItem, destinationIndex) => (
                      <div
                        key={destinationIndex}
                        className="w-full  flex gap-[20px]"
                      >
                        <div
                          className={
                            "h-[20px] w-[20px] rounded-md " +
                            destinationItem.color
                          }
                        ></div>
                        <p className="">
                          <b>Location:</b>{" "}
                          {destinationItem.location === ""
                            ? "None"
                            : destinationItem.location}{" "}
                        </p>

                        <p className="">
                          <b>BST:</b>{" "}
                          {destinationItem.beforeSchoolTime === ""
                            ? "None"
                            : destinationItem.beforeSchoolTime}
                        </p>

                        <p>
                          AST:{" "}
                          {destinationItem.afterSchoolTime === ""
                            ? "None"
                            : destinationItem.afterSchoolTime}
                        </p>
                      </div>
                    ),
                  )}
                {busItem.isClicking && busItem.destinations.length === 0 && (
                  <p>None</p>
                )}
                {!busItem.isClicking && (
                  <p>
                    Click to view <b>({busItem.destinations.length} stops)</b>
                  </p>
                )}
              </div>
              {isAdmin && (
                <div className="flex items-center w-1/4 gap-[10px]">
                  <Btn text="Edit" onclick={() => setIndex(busIndex)} primary />
                </div>
              )}
            </div>
          </div>
        ))}
        {buses.length == 0 && (
          <p className="text-zinc-700 dark:text-zinc-300 text-sm text-center py-10">
            No buses created yet. Make one by using the button above!
          </p>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm flex gap-x-3 items-center">
          <FaExclamationTriangle size={15} /> {error}
        </div>
      )}
      {isAdmin && (
        <Btn
          onclick={handleSave}
          text={loading ? "Saving..." : "Save"}
          primary
          styles="w-fit"
        />
      )}
      <AnimatePresence>
        {index !== null && (
          <EditBus index={index} closeModal={() => setIndex(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
