import type { GuideType } from "@/lib/schemas";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { FaBookOpen } from "react-icons/fa";
import Guides from "./guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "View detailed guides, tips, and additional information about using Iridium for your school on this page!",
  authors: [
    { name: "Iron Hands Team", url: "https://github.com/iron-hands-team" },
  ],
  openGraph: {
    title: "Guides",
    description:
      "View detailed guides, tips, and additional information about using Iridium for your school!",
    url: "https://iridium.tonymac.net/guides",
    siteName: "Iridium",
    images: [{ url: "/logo.png", width: 100, height: 100 }],
    type: "website",
  },
};

//TODO: add more guide pages

async function Page() {
  const { cookie } = await getSession();
  const guides: GuideType[] = await fetch(
    `${process.env.INTERNAL_API_URL}/guides`,
    {
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    },
  ).then((res) => res.json());

  return (
    <div className="px-4 sm:px-10 lg:px-50 flex py-10 pb-10 flex-col gap-y-5">
      <h2 className="text-xl font-bold flex items-center gap-x-3">
        <FaBookOpen size={18} /> Guides
      </h2>
      <Guides guides={guides} />
    </div>
  );
}

export default Page;

// async function Page() {
//   return (
//     <div>
//       <div className="flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto flex-col flex-wrap">
//         <div className="bg-black/90 h-2/3 w-2/3 flex flex-col justify-between items-start border-1 border-zinc-400 overflow-y-auto p-[10px] text-[20px]">
//           <div className="flex flex-col w-full h-full gap-y-5">
//             <p>
//               <b>How to use the Bus Manager</b>
//             </p>
//             <p>
//               <b>The Nav Bar:</b> Contains the &quot;Add Bus&quot;, &quot;Clear
//               Buses&quot;, and &quot;About&quot; buttons.
//             </p>
//             <p>
//               <b>Creating Buses:</b> Go to the top-left or bottom-center and you
//               will see the add Bus. Click on it and a new bus row should appear.
//             </p>
//             <p>
//               <b>Inside each row:</b> The Spot number, Bus Name, It&apos;s
//               Route, and additional notes.
//             </p>
//             <p>
//               <b>To edit the bus information:</b> Go to the &quote;Edit&quot;
//               button on the right of the row. The bus editor board should pop
//               up.
//             </p>
//             <p>
//               Inside the editor board: All of the functions will be gone over
//               here
//             </p>
//             <p>
//               <b>Name:</b> A text-field for the bus&apos;s name
//             </p>
//             <p>
//               <b>Description:</b> For is for extra information about the buses
//             </p>
//             <p>
//               <b>Managing Bus Stops:</b> To create a new bus stop for the route,
//               press on the &quot;Add Destination&quot; button. Each destination
//               created contains the location, before school time and after school
//               time. There is a delete destination button on the right.
//             </p>
//             <p>
//               <b>BST:</b> Before School Time. Bus&apos;s arrival time before
//               school starts.
//             </p>
//             <p>
//               <b>AST:</b> After School Time. Bus&apos;s arrival time after
//               school ends.
//             </p>
//             <p>
//               <b>Colors:</b> This is to color code the bus row. Helps find buses
//               easier and can be used to sort them out.
//             </p>
//             <p>
//               <b>Delete Bus Button: </b>Deletes the bus row.
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="flex h-full w-full justify-center items-center bg-black/90 ">
//         <div className="h-[750px] w-3/4 overflow-y-auto flex flex-col justify-start items-start border-1 border-zinc-400 bg-black text-[30px] p-[10px]">
//           <p className="text-[45px]">Class Dashboard help:</p>
//           <p>
//             <b>What is this?</b>
//           </p>
//           <p>
//             This is where you manage all of your classes. Students, assignments,
//             and announcments are all here.
//           </p>
//           <br></br>
//           <p>How do you create and manage a class?</p>
//           <p>
//             To start, press the &quot;Add Class&quot; button on the top-left. A
//             new class should appear.
//           </p>
//           <br></br>
//           <p>
//             There are a few buttons and text-fields inside the class you
//             created. They are easy to learn! Will be put into the bullet points
//             below:
//           </p>
//           <p>
//             <b>Class Name Text-field:</b> Right now, it should be called
//             &quot;untitled&quot;. TO change that, click on it and enter you
//             class&apos;s name. It automatically saves.
//           </p>
//           <p>
//             <b>Manage Announcements:</b> This will be the tool for you to
//             communicate to the students in this class. The announcements board
//             contains a place for you to make new messages(All students will be
//             able to see), and the previous ones you made.
//           </p>
//           <p>
//             <b>Manage assignments:</b> Making new assignments has never been
//             easier! To do so, click on the &quot;Make New Assignment&quot;.
//             Then, plug in the name, description, and the homework link into the
//             thing you just made.
//           </p>
//           <p>
//             <b>Manage Quizzes:</b> You can create custom quizzes in the quiz
//             board for this class. The quizzes hold multiple choice questions.
//             After creating choice for a question and you want to set a few or
//             one into an answer, click the &quot;Set As Answer&quot; button next
//             to them. Each quiz automatically saves.
//           </p>
//           <p>
//             <b>How to manage students:</b> First, create a new student. Next,
//             change it&apos;s name in the text-field to the left, then,
//           </p>
//         </div>
//       </div>

//       <div className="flex h-full w-full justify-center items-center bg-black/90">
//         <div className="h-[750px] w-3/4 overflow-y-auto flex flex-col justify-start items-start border-1 border-zinc-400 bg-black text-[20px] p-[10px] relative">
//           <p className="text-[45px]">Club Dasboard help:</p>
//           <p>
//             Note: This is for the school system, not for teacher nor students
//           </p>
//           <br></br>
//           <p>
//             Making a Club: Click on the button in the control bar on the top
//           </p>
//           <p>To View Information inside a club: Click on the club bar.</p>
//           <p>
//             To Edit Information, click on the edit on the right in the
//             information banner. Note: Both Club Managers and School System can
//             change club&apos;s information
//           </p>
//           <br></br>
//           <p>Informations that ccan be stored and altered in the bar:</p>
//           <p>Name: Make a name what people can easily search for.</p>
//           <p>
//             ID: I don&apos;t really know. Schools can choose what it&apos;s
//             purpose is.
//           </p>
//           <p>Description: What your club is about.</p>
//           <p>
//             Managers: There can be multiple managers. Just click on the
//             &quot;Add manager&quot;. Delete a maanger by clicking on the manager
//             you want to delete.
//           </p>
//           <p>
//             Members: Students. Students cannot alter club information, unless
//             they get promoted to manager. Students information cannot be viewed
//             in the app.
//           </p>
//           <br></br>
//           <p>
//             Bookmarking a club: The left side of the club bar, click on the
//             square. Click again to unbookmark.
//           </p>
//           <p>
//             Deleting a club: To Edit Mode, you will see a button at the bottom.
//             Only use this if you are certain!
//           </p>
//           <br></br>
//           <p>
//             Tags: Tags help you organize and sort out your clubs by genre or
//             whatever you want.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Page;
