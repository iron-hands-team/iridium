import type { TipType } from "@/types/info";
import { FaBook, FaExclamationCircle } from "react-icons/fa";

export const roles = ["student", "teacher", "admin"];

export const tips: TipType[] = [
  {
    icon: <FaBook size={17} />,
    text: "Click on your avatar on the nav bar to open a menu of options!",
  },
  {
    icon: <FaExclamationCircle size={17} />,
    text: "Submit a report from the nav user menu",
  },
  {
    icon: <FaBook size={20} />,
    text: "Make sure to do your work so teach doesn't get mad",
  },
  {
    icon: <FaExclamationCircle size={1000}/>,
    text: "🤨🤨🤨🤨"
  },
  {
    icon: <FaBook size={20}/>,
    text: "🤤🤤🤤🤤"
  }
]; //TODO: if you ran out of ideas, add some tips about using iridium here
