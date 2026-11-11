import { create } from "zustand";
import { useRouter } from "next/navigation";

// school account's side

export type Bus = {
  id: number;
  name: string;
  desc: string;
  color: string;
  destinations: Destination[];
  isClicking: boolean;
};

type Destination = {
  location: string;
  beforeSchoolTime: string;
  afterSchoolTime: string;
  color: string;
};

type busStore = {
  buses: Bus[];

  // fetchBuses: ()=> Promise<void>;
  // saveBuses: ()=> Promise<void>;

  addBus: () => void;
  updateFrame: () => void;
  deleteBus: (busindex: number) => void;
  setBus: <T>(busTargetIndex: number, variableName: string, value: T) => void;
  setBuses: <T>(buses: Bus[]) => void;
  insertBus: (busSwappingIndex: number, busVictimIndex: number) => void;
  clearBuses: () => void;

  addDestination: (index: number, destinations: Destination[]) => void;
  deleteDestination: (
    destinations: Destination[],
    destinationIndex: number,
  ) => Destination[];
  setDestination: <T>(
    destinations: Destination[],
    destinationTargetIndex: number,
    variableName: string,
    value: T,
  ) => Destination[];

  aboutPopup: boolean;
  setAboutPopup: (aboutPopup: boolean) => void;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export const bs = create<busStore>((set, get) => ({
  aboutPopup: false,
  setAboutPopup: (aboutPopup) => set({ aboutPopup }),

  buses: [],

  // fetchBuses: async () => {
  //   const response = await fetch(`api/buses`,  {
  //       credentials: "include"
  //   })
  //   if(!response.ok) {
  //     throw new Error("Cant fetch");
  //   }

  //   const data = await response.json();
  //   set({
  //     buses: data.map((bus:any) => ({
  //       id: bus.id,
  //       name: bus.name,
  //       desc: bus.description,
  //       color: bus.color,
  //       destinations: bus.destinations,
  //       isClicking: false
  //     }))
  //   })
  // },

  // saveBuses: async () => {
  //   const response = await fetch(`api/buses`,  {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {"Content-Type": "application/json"},
  //     body: JSON.stringify(
  //       get().buses.map((bus) => ({
  //         name: bus.name,
  //         description: bus.desc,
  //         destinations: bus.destinations,
  //         isClicking: bus.isClicking
  //       }))
  //     )
  //   })

  //   if(!response.ok)
  //       throw new Error("No Buses :(");

  //   await get().fetchBuses();
  // },

  updateFrame: () =>
    set((state) => ({
      buses: [...state.buses],
    })),

  addBus: () =>
    set((state) => ({
      buses: [
        ...state.buses,
        {
          id: state.buses.length,
          name: "Untitled",
          desc: "",
          color: "bg-yellow-400",
          destinations: [],
          isClicking: false,
        },
      ],
    })),
  deleteBus: (busIndex) =>
    set((state) => ({
      buses: state.buses.filter((_, index) => index !== busIndex),
    })),

  setBuses: (buses) => set(() => ({ buses })),

  setBus: (busTargetIndex, variableName, value) =>
    set((state) => ({
      buses: state.buses.map((busItem, busIndex) =>
        busIndex === busTargetIndex
          ? { ...busItem, [variableName]: value }
          : busItem,
      ),
    })),

  insertBus: (busSwappingIndex, busVictimIndex) =>
    set((state) => {
      const buses = [...state.buses];

      const [bus] = buses.splice(busVictimIndex, 1);
      buses.splice(busSwappingIndex, 0, bus);

      return { buses };
    }),
  addDestination: (index, destinations) => {
    set((state) => {
      return {
        ...state,
        buses: [
          ...state.buses.slice(0, index),
          {
            ...state.buses[index],
            destinations: [
              ...destinations,
              {
                location: "",
                beforeSchoolTime: "",
                afterSchoolTime: "",
                color: "",
              },
            ],
          },
          ...state.buses.slice(index + 1),
        ],
      };
    });
  },
  deleteDestination: (destinations, destinationIndex): Destination[] => {
    return destinations.filter((_, i) => i !== destinationIndex);
  },
  setDestination: (
    destinations,
    destinationTargetIndex,
    variableName,
    value,
  ): Destination[] => {
    return destinations.map((destinationItem, destinationIndex) =>
      destinationIndex === destinationTargetIndex
        ? { ...destinationItem, [variableName]: value }
        : destinationItem,
    );
  },

  clearBuses: () =>
    set(() => ({
      buses: [],
    })),
}));
