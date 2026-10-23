import {create} from "zustand"

// school account's side

type Bus = {
 id: number;
 name: string;
 desc: string;
 color: string;
 destinations: Destination[];
 isClicking: boolean;
}

type Destination = {
 location: string;
 beforeSchoolTime: string;
 afterSchoolTime: string;
 color: string;
}

type busStore = {
 buses: Bus[];
 addBus: () => void;
 updateFrame: () => void;
 deleteBus: (busindex:number) => void;
 setBus: <T>(busTargetIndex:number, variableName:string, value:T) => void;
 insertBus: (busSwappingIndex:number, busVictimIndex:number) => void;
 clearBuses: () => void;

 addDestination: (destinations:Destination[]) => Destination[];
 deleteDestination: (destinations:Destination[], destinationIndex:number) => Destination[];
 setDestination: <T>(destinations:Destination[], destinationTargetIndex:number, variableName:string, value:T) => Destination[];

 aboutPopup: boolean;
 setAboutPopup: (aboutPopup:boolean) => void;
}

export const bs = create<busStore>((set) => ({
 aboutPopup: false,
				setAboutPopup: (aboutPopup)=> set({aboutPopup}),

 buses: [],

updateFrame: () => set((state) => ({
  buses: [...state.buses]
})),

 addBus: () => set((state) => ({
  buses: [...state.buses, {
   id: state.buses.length,
   name: "Untitled",
   desc: "",
   color: "bg-yellow-400",
   destinations: [],
   isClicking: false
  }]
 })),
 deleteBus: (busIndex) => set((state) =>({
  buses: state.buses.filter((_, index) => index !== busIndex)
 })),

 setBus: (busTargetIndex, variableName, value) => set((state) => ({
  buses: state.buses.map((busItem, busIndex) => 
   busIndex === busTargetIndex ? {...busItem, [variableName]: value} : busItem
  )
 })),

insertBus: (busSwappingIndex, busVictimIndex) => set((state) => {
    const buses = [...state.buses];

    const [bus] = buses.splice(busVictimIndex, 1);
    buses.splice(busSwappingIndex, 0, bus);

    return { buses };
}),
addDestination: (destinations): Destination[] => {
 return [...destinations, {
  location: "",
  beforeSchoolTime: "",
  afterSchoolTime: "",
  color: "",
 }]
},
deleteDestination: (destinations, destinationIndex): Destination[] => {
  return destinations.filter((_, i) => i !== destinationIndex);
},
setDestination: (destinations, destinationTargetIndex, variableName, value): Destination[] => {
 return destinations.map((destinationItem, destinationIndex) => (
   destinationIndex === destinationTargetIndex ? {...destinationItem, [variableName] : value} : destinationItem
 ));
},

clearBuses: () => set((state)=> ({
 buses: []
}))



 
}))