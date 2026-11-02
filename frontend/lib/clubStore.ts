import {create} from "zustand"

type Club = {
 id: number;
 group: string;
 name: string;
 desc: string;
 tags: Tag[];
 students: Person[];
 managers: Person[];
 location: string;
 isBookedMarked: boolean;
 schedule: Time[];
 //isSelected: boolean;
}
type Time = {
  day: string;
  startingTime: string; 
  endingTime: string;
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

 selection: number[];

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

 updateFrame: (clubs:Club[], tags:Tag[]) => void;
 addClub: () => void;
 deleteClub: (clubIndex:number) => void;
 setClub: <T>(clubIndex:number, variableName:string, value:T) => void;

 addTag: (tags:Tag[], tag:Tag)=>Tag[];
 deleteTag: (tags:Tag[], tagIndex:number) => Tag[];
 setTag: <T>(tags:Tag[], tagIndex:number, variableName:string, value:T) => Tag[];

 addPerson: (students:Person[]) => Person[];
 deletePerson: (students:Person[], studentIndex:number) => Person[];
 setPerson: <T>(students:Person[], studentIndex:number, variableName:string, value:T) => Person[];

 addTime: (schedule:Time[]) => Time[];
 deleteTime: (schedule:Time[], index:number) => Time[];
  setTime: <T>(schedule:Time[], timeIndex:number, variableName:string, value:T) => Time[];

  addSelection: (clubIndex:number) => void;
  deleteSelection: (clubIndex:number)  => void;
  deleteEverythingSelection: () => void;

  selectionControlBar: boolean;
  setSelectionControlBar: (input:boolean) => void;

  deleteEverythingClub: () => void;
  deleteEverythingTag: () => void;

  clubBarHeight: number;
  setClubBarHeight: (input:number) => void;

  fontSize: number;
  setFontSize: (input:number) => void;

  settings: boolean;
  setSettings: (input:boolean) => void;
  
}

export const cls = create<busStore>((set) => ({
  selectionControlBar: false,
  setSelectionControlBar:(selectionControlBar) => set({selectionControlBar}),

 clubs: [],
 tags: [],

 selection: [],

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

 updateFrame: (clubs, tags) => set((state) => ({
  clubs: [...clubs],
  tags: [...tags]
 })),

 


 addTag: (tags, tag): Tag[] => { 
  if(tag.name == "")
      return [...tags, {
    name: "Untitled Tag",
    color: "bg-zinc-400",
    isHidden: false,
    }]
  else
    return [...tags,  {
  name: tag.name,
  color: tag.color,
  isHidden: false
  }]
 },

 deleteTag: (tags, tagIndex): Tag[] => {
  return tags.filter((_,i)=>i!==tagIndex);
 },

 setTag: (tags, tagTargetIndex, variableName, value): Tag[] => {
  return tags.map((tagItem, tagIndex) => (
   tagIndex === tagTargetIndex ? {...tagItem, [variableName]: value} : tagItem
  ))
 },




 addClub: () => set((state) => ({
  clubs: [...state.clubs, {
   id: state.clubs.length,
   group: "",
   name: "[Untitled Club]",
   desc: "[No Description]",
   tags: [],
   students: [],
   managers: [],
   location: "Not Provided",
   isBookedMarked: false,
   schedule: [],
   //isSelected: false
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
   name: "",
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
 addTime: (s): Time[]=> {
  return [...s, {
    day: "",
    startingTime: "",
    endingTime: "",
  }]
 },
 deleteTime: (s, index): Time[]=> {
  return s.filter((_,i) => i !== index);
 },

 setTime: (s, scheduleTargetIndex, variableName, value): Time[] => {
  return s.map((_, sIndex) => sIndex === scheduleTargetIndex ? {..._, [variableName]: value} : _);
 },

 addSelection: (clubIndex) => set((state) => ({
  selection: [...state.selection, clubIndex]
 })),

 deleteSelection: (clubIndex) => set((state) => ({
  selection: state.selection.filter((selectionItem, _) =>
  selectionItem !== clubIndex)
 })),

 deleteEverythingSelection: () => set((state) => ({
  selection: []
 })),

 deleteEverythingClub: () => set((state) => ({
    clubs: []
 })),

 deleteEverythingTag: () => set((state) => ({
  tags: []
 })),

 settings: false,
 setSettings: (settings) => set({settings}),

 clubBarHeight: 50,
 setClubBarHeight: (clubBarHeight) => set({clubBarHeight}),

 fontSize: 18,
 setFontSize: (fontSize) => set({fontSize}),

 
}))