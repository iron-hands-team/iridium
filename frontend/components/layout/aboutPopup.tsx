"use client";

import { useState } from "react";
import Btn from "@/components/ui/btn";
import "@/app/globals.css";
import {cs} from "@/lib/classStore";

export default function aboutPopup() {
 const aboutPopup = cs((state)=>state.aboutPopup);
 const setAboutPopup = cs((state)=>state.setAboutPopup);

 return (
  <div>
   
  </div>
 );
}