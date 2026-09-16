"use client";
import { useState } from "react";
import Footer from "../components/layout/footer";
import "./globals.css";
import Btn from "@/components/ui/btn";
import Nav from "@/components/layout/nav";


// my plan is to create a simple database first
// this database stores attendee's info
// then loads here
// the class is temporary

class TestClass {
  asd : string;
  constructor(asd: string) {
    this.asd = asd;
  }
}


export default function Home() {
  // example list full of stuff
  const [test, setTest] = useState<TestClass[]>([]);
  function addTest() {
    setTest([...test, new TestClass("asdasd")])
  }

  return (
    <html style={{ backgroundColor: ""}}>
      <body>
        <div style={{ backgroundColor: "blue", height: "100vh"}}>

          <div style={{backgroundColor: "#242424", height: "100%", }}> 

            <Nav></Nav>

            <h1 className="text-white text-3xl text-center font-bold" style={{height: "60px", display: "flex", alignItems: "center", justifyContent: "center"}}>
              Aiden's cool dashboard
            </h1>

            <div style={{backgroundColor: "red", display: "flex", gap: "20px", height: "60px", alignItems: "center", padding: 10}}>
              
              <Btn onClick={addTest}><p style={{fontSize: "15px",cursor: "pointer"}}>Add Section</p></Btn>
            </div>


            <div style={{backgroundColor: "blue", display: "flex", alignItems: "center", flexDirection: "column", gap: "20px", padding: 10}}>
              {test.map((_, i) => (
                <div key={i} style={{width: "80%", height: "100px", backgroundColor: "#9b9999"}}>
                    <p>{_.asd}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
        <Footer/>
      </body>
    </html>
  );
}
