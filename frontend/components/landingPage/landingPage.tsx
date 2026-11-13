"use client"

import {useState, useEffect} from "react";
import { AnimatePresence } from "framer-motion";
import { FaBell, FaBullhorn, FaCalendar, FaLink, FaMap, FaGem } from "react-icons/fa";

import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";

import CoolTile from "@/components/landingPage/coolTile";

export default function LandingPage() {
//  const [showText, setShowText] = useState<Boolean>();
 const [arrayTexts, setArrayTexts] = useState<string[]>([]);
 const [emailInput, setEmailInput] = useState<string>("");

 const texts = [
	"Iridium",
	"The Most Longlasting and Durable App for Learning.",
	"Iridium is an easy to use online platform for schools to post announcements, view schedules, and manage students and staff, inspired by TJHSST's intranet Ion."
 ]

	
	function tp(textPiece: string) {
			const index = texts.findIndex(t => t == textPiece);

			if (index !== -1) {
					[arrayTexts[index], arrayTexts[arrayTexts.length-1]] = [arrayTexts[arrayTexts.length-1], arrayTexts[index]]; 
					return arrayTexts[arrayTexts.length-1];
			}
			return "";
	}


	useEffect(() => {
    let currentText = 0;

    setArrayTexts(texts.map(() => ""));

    const timer = setInterval(() => {
        setArrayTexts((previous) => {
            if (currentText >= texts.length) {
                clearInterval(timer);
                return previous;
            }

            const updated = [...previous];

            if (updated[currentText].length < texts[currentText].length) {
                updated[currentText] += texts[currentText][updated[currentText].length];
            } else {
                currentText++;
            }

            return updated;
        });
    }, 100);

    return () => clearInterval(timer);

}, []);


 return (
	<div className="fixed inset-0 bg-black overflow-auto overflow-x-hidden">			
		<div className=" h-[450px] p-[10px] flex flex-col justify-center  items-center relative bg-gray-900">
	
			<nav className="flex w-full  items-center justify-between bg-blue-500 h-[80px] fixed top-0 p-[10px] z-10">

				<div className="flex w-1/2 items-center gap-[10px]">
					<FaGem size={30}/>
					<p>Iridium</p>
					<Btn onclick={()=>{}} text="Products"/>
				</div>
				<div className="flex w-1/2 justify-end gap-[10px]">
					<Input value={""} setValue={(e)=>{}} placeholder="Search"/> 
					<Btn onclick={()=>{}} text="About"/>
				</div>
			</nav>
			
			<div className="flex flex-col justify-center items-center gap-[20px]">

				<p className="text-[30px]"><b>{tp("The Most Longlasting and Durable App for Learning.")}</b></p>
				<div className="flex">

					<Input value={emailInput} setValue={(e)=>setEmailInput(e)} placeholder={"Enter your email"}/>
					<div className="bg-green-500"><Btn onclick={()=>{}} text={"Submit"}/></div>
				</div>
			</div>			
		</div>

		<div className="relative ">

			<div className="relative z-5 flex justify-center items-center">

				<div className="p-[10px] w-2/3 ">

					<p>{tp("Iridium is an easy to use online platform for schools to post announcements, view schedules, and manage students and staff, inspired by TJHSST's intranet Ion.")}</p>
				</div>
			</div>

			<div className="absolute top-0 overflow-hidden flex flex-wrap bg-green-500 min-h-screen w-[5000px] ">

				{Array.from({ length: 5000 }, (_, index) => (
					<CoolTile key={index}/>
				))}
			</div>

		</div>
	</div>
 )
}