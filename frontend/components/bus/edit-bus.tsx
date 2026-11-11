"use client";

import { bs } from "@/lib/busStore";
import { FaSign, FaTrash } from "react-icons/fa";
import Btn from "../ui/btn";
import Modal from "../ui/modal";
import Input from "../ui/input";

const buttonColors: Record<string, string> = {
  blue: "bg-blue-400",
  red: "bg-red-400",
  green: "bg-green-400",
  yellow: "bg-yellow-400",
  purple: "bg-purple-400",
  gray: "bg-zinc-400",
};
const labelStyles = "text-sm flex flex-col gap-y-1";

interface EditBusProps {
  index: number;
  closeModal: () => void;
}

function EditBus({ index, closeModal }: EditBusProps) {
  const buses = bs((state) => state.buses);
  const updateFrame = bs((state) => state.updateFrame);
  const setBus = bs((state) => state.setBus);
  const addDestination = bs((state) => state.addDestination);
  const deleteDestination = bs((state) => state.deleteDestination);
  const setDestination = bs((state) => state.setDestination);

  function DestinationUI(
    destinationIndex: number,
    variableName: string,
    headingName: string,
  ) {
    return (
      <div className={labelStyles}>
        {headingName}
        <Input
          value={
            buses[index].destinations[destinationIndex][
              variableName as "location"
            ]
          }
          setValue={(value) => {
            buses[index].destinations = setDestination(
              buses[index].destinations,
              destinationIndex,
              variableName,
              value,
            );
            updateFrame();
          }}
        ></Input>
      </div>
    );
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">
          Edit {buses[index].name}&apos;s Information
        </h2>
        <label className={labelStyles}>
          <div>
            Name <span className="text-red-500">*</span>
          </div>
          <Input
            value={buses[index].name}
            setValue={(name) => setBus(index, "name", name)}
          />
        </label>
        <label className={labelStyles}>
          <div>
            Description <span className="text-red-500">*</span>
          </div>
          <Input
            value={buses[index].desc}
            setValue={(desc) => {
              setBus(index, "desc", desc);
              updateFrame();
            }}
          />
        </label>
        <div className={labelStyles}>
          Color
          <div className="flex gap-x-2">
            {Object.entries(buttonColors).map(([i, value]) => (
              <div
                key={i}
                className={
                  "w-[30px] h-[30px] rounded-md cursor-pointer " +
                  value +
                  (buses[index].color === value ? " ring-2 ring-white" : "")
                }
                onClick={() => setBus(index, "color", value)}
              />
            ))}
          </div>
        </div>
        <p>Bus Stops </p>
        {buses[index].destinations.length > 0 && (
          <div className="flex flex-col gap-y-3">
            {buses[index].destinations.map((_, destinationIndex) => (
              <div
                key={destinationIndex}
                className="w-full flex flex-col gap-y-3"
              >
                <div className="flex justify-between text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  <div className="flex items-center gap-x-2">
                    <FaSign size={13} /> Destination #{destinationIndex + 1}
                  </div>
                  <FaTrash
                    size={13}
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      buses[index].destinations = deleteDestination(
                        buses[index].destinations,
                        destinationIndex,
                      );
                      updateFrame();
                    }}
                    title="Delete destination"
                  />
                </div>
                <div className="flex flex-col gap-y-3 border border-zinc-800 p-3">
                  {DestinationUI(destinationIndex, "location", "Location")}
                  {DestinationUI(
                    destinationIndex,
                    "beforeSchoolTime",
                    "Before School Time",
                  )}
                  {DestinationUI(
                    destinationIndex,
                    "afterSchoolTime",
                    "After School Time",
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <Btn
          onclick={() => addDestination(index, buses[index].destinations)}
          text="Add Destination"
        />
        <div className="flex">
          <Btn text="Save" onclick={closeModal} primary />
        </div>
      </div>
    </Modal>
  );
}

export default EditBus;
