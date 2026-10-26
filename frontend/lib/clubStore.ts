import {create} from "zustand"

type Club = {
 id: number;
 name: string;
 desc: string;
 tag: Tag;
 students: Person[];
 managers: Person[];
 location: string;
 isBookedMarked: boolean;
}

type Tag = {
 name: string;
 color: string;
 isHidden: boolean;
}

type Person = {
 id: number;
 name: string;
 desc: string;
}

type busStore = {
 clubs: Club[];
 tags: Tag[];

 

 aboutPopup:boolean;
 setAboutPopup: (aboutpopup:boolean) => void;

 canViewBookMarks:boolean;
 setCanViewBookMarks:(canViewBookMarks:boolean)=>void;

 canViewAll:boolean;
 setCanViewAll:(canViewAll:boolean)=>void;

 canEdit: boolean;
 setCanEdit: (canEdit:boolean) => void;

 canEditTags: boolean;
 setCanEditTags: (canEditTags:boolean) => void;

 clubTargetIndex: number;
 setClubTargetIndex: (clubTargetIndex:number) => void;

 updateFrame: () => void;
 addClub: () => void;
 deleteClub: (clubIndex:number) => void;
 setClub: <T>(clubIndex:number, variableName:string, value:T) => void;

 addTag: ()=>void;
 deleteTag: (tagIndex:number) => void;
 setTag: <T>(tagIndex:number, variableName:string, value:T) => void;

 addPerson: (students:Person[]) => Person[];
 deletePerson: (students:Person[], studentIndex:number) => Person[];
 setPerson: <T>(students:Person[], studentIndex:number, variableName:string, value:T) => Person[];
}

export const cls = create<busStore>((set) => ({


 clubs: [],
 tags: [],

 canViewAll: true,
 setCanViewAll: (canViewAll) => set({canViewAll}),

 canViewBookMarks: true,
 setCanViewBookMarks: (canViewBookMarks) => set({canViewBookMarks}),

 aboutPopup: false,
 setAboutPopup: (aboutPopup) => set({aboutPopup}),

 canEditTags: false,
 setCanEditTags: (canEditTags) => set({canEditTags}),

 canEdit: false, 
 setCanEdit: (canEdit) => set(({canEdit})),

 clubTargetIndex: -1,
 setClubTargetIndex: (clubTargetIndex) => set({clubTargetIndex}),

 updateFrame: () => set((state) => ({
  clubs: [...state.clubs]
 })),


 addTag: () => set((state) => ({
  tags: [...state.tags, {
   name: "Untitled Tag",
   color: "bg-zinc-400",
   isHidden: false,
  }]
 })),

 deleteTag: (tagIndex) => set((state)=>({
  tags: state.tags.filter((_,i)=>i!==tagIndex)
 })),

 setTag: (tagTargetIndex, variableName, value) => set((state) => ({
  tags: state.tags.map((tagItem, tagIndex) => (
   tagIndex === tagTargetIndex ? {...tagItem, [variableName]: value} : tagItem
  ))
 })),


 addClub: () => set((state) => ({
  clubs: [...state.clubs, {
   id: state.clubs.length,
   name: "[Untitled Club]",
   desc: "[No Description]",
   tag: {name: "", color:"", isHidden: false,},
   students: [],
   managers: [],
   location: "Not Provided",
   isBookedMarked: false
  }]
 })),
 deleteClub: (clubIndex) => set((state) => ({
  clubs: state.clubs.filter((_, i) => i!==clubIndex)
 })),
 setClub: (clubTargetIndex, variableName, value) => set((state) => ({
    clubs: state.clubs.map((clubItem, clubIndex) => 
  clubIndex === clubTargetIndex ? {...clubItem, [variableName]: value} : clubItem)
 })),

 addPerson: (students): Person[] => {
  return [...students, {
   id: students.length,
   name: "Untitled",
   desc: ""
  }]
 },
 deletePerson: (students, studentIndex): Person[] => {
  return students.filter((_, i) => i!==studentIndex);
 },

 setPerson: (students, studentTargetIndex, variableName, value): Person[] => {
  return students.map((studentItem, studentIndex) => 
  studentIndex === studentTargetIndex ? {...studentItem, [variableName]: value} : studentItem);
 },


 


}))