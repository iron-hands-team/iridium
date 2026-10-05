"use client"

import {useState} from "react";
import {cs} from "@/lib/classStore";
import Btn from "@/components/ui/btn";

export default function SettingsPopupClassTeacher() {

 	const announcementInput = cs((state)=>state.annoucementInput);
	const setAnnouncementInput= cs((state)=>state.setAnnouncementInput);

	const settingsClassIndex = cs((state)=> state.settingsClassIndex);

	const untitledCount = cs((state)=>state.untitledCount);

	const setMessagePopup = cs((state)=>state.setMessagePopup);


	const classes = cs((state) => state.classes);

	const addAnnouncementsToStudents = cs((state) => state.addAnnouncementsToStudents);
	const addClassAnnouncement = cs((state) => state.addClassAnnouncement);
	const setAnnouncementClass = cs((state) => state.setAnnouncementClass);
	const setAnnouncementStudent = cs((state) => state.setAnnouncementStudent);


 return (
  				<div className="fixed flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto  flex-col flex-wrap" onClick={() => setMessagePopup(false)}>
					<div className="bg-black/90  z-10 overflow-y-auto w-2/3  flex justify-center items-center border-1 border-zinc-400 "  onClick={(e) => e.stopPropagation()}>
						<div className=" h-[500px] w-3/4 bg-blue">
							<br></br>
							<div className="flex justify-between">
								<p className="text-[30px]"><b>Manage Announcements📢</b></p>
								<div className="w-[100px]"><Btn onclick={()=>setMessagePopup(false)} text="Close"/></div>
							</div>
							<br></br>
							<div className="h-full w-full gap-[10px] border-1 border-zinc-800 p-5 flex bg-gray-900 flex-col">
								<p>Make Announcement:</p>
								<textarea
									placeholder="Type Announcement Here:"
									className="text-white w-full resize-none h-1/5 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans mt-[10px]"
									value={announcementInput}
									onChange={(e)=>setAnnouncementInput(e.target.value)}
								></textarea>
								<div className="w-1/3 my-[20px] border-1 border-yellow-800"><Btn onclick={()=> {addClassAnnouncement(settingsClassIndex, announcementInput,untitledCount);addAnnouncementsToStudents(settingsClassIndex, announcementInput,announcementInput,untitledCount)}} text="Post"/></div>
							</div>
							<br></br>
							<p>Previous Announcements:</p>
							<br></br>
							<div className="overflow-y-auto ">
								{classes[settingsClassIndex].announcements.map((announcement, announcementIndex) => (
									<div key={announcementIndex} className="h-full w-full gap-[10px] border-1 border-zinc-800 p-5 flex bg-gray-900 flex-col">
										<p><b>{announcement.date}</b></p>
										<textarea
									placeholder="Enter Assignment Name"
									className="text-white w-full resize-none h-12 p-2 border  border-zinc-800 hover:border-white text-[18px] font-sans "
										value={announcement.text}
										onChange={(e)=>{setAnnouncementClass(settingsClassIndex, announcementIndex, e.target.value, "text"); setAnnouncementStudent(settingsClassIndex, announcementIndex, e.target.value, "text")}}
										></textarea>

									</div>
								))}
							</div>
							<br></br>
							<Btn onclick={()=>setMessagePopup(false)} text="Close"/>
							<br></br>
							<br></br>
						</div>
					</div>
				</div>
 );
}