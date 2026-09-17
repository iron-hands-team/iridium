"use client";
import { useState } from "react";
import Footer from "../components/layout/footer";
import "./globals.css";
import Btn from "@/components/ui/btn";
import Nav from "@/components/layout/nav";
import React from "react";
import { u } from "framer-motion/client";
import { color } from "framer-motion";


// my plan is to create a simple database first
// this database stores attendee's info
// then loads here
// the class is temporary

interface TestInterface {
  id : number;
  text : string;
  div: React.ReactElement<React.HTMLAttributes<HTMLDivElement>>;
}

class TestClass {

  
  id : number;
  text : string;
  div: React.ReactElement<React.HTMLAttributes<HTMLDivElement>>;

  constructor({ id, text, div} : TestInterface) {
        this.id = id;
        this.text = text;
        this.div = div; 
  }
    editDiv() {
      if (React.isValidElement(this.div)) {
          this.div = React.cloneElement(this.div, {
              style:{
                width: "80%",
                height: "100px",
                backgroundColor: "#9b9999",
                display: "flex",
                
              },
              
              children: <div>
                <p>{this.id}</p>
                <p>{this.text}</p>
                {this.div.props.children}
              </div>
          });
      }
    }
}



export default function Home() {
  // example list full of stuff
  const [test, setTest] = useState<TestClass[]>([]);
  const [asd , setasd] = useState(""); // the input on the bottom nav ( testing)
const [childStates, setChildStates] = useState<string[]>([]);  const [inputs, setInputs] = useState<React.ReactElement[]>([]);

  function addTest() {
      let temp = test.length;
      setChildStates([...childStates, ""]);
      const newTest = new TestClass(
        {
          id: test.length,
          text: "asdasd",
          div: <div><input
          onChange={(e) => {
            setChildStates(prev => {
              const newStates = [...prev];
              newStates[temp] = e.target.value;
              return newStates;
            });
          }}
          /></div>
        }
      );

      newTest.editDiv();

      setTest([...test, newTest]);

      for(let  i = 0; i < test.length;i ++) {
        test[i].id = i;
      }
  }
  
  function deleteTest(index : number) {
    setTest(test.filter((_, i) => i !== index));
    setInputs(inputs.filter((_, i) => i !== index));
    setChildStates(childStates.filter((_, i) => i !== index));

    for(let  i = 0; i < test.length;i ++) {
      test[i].id = 0;
    }
  }

  function addDiv(div : React.ReactElement<React.HTMLAttributes<HTMLDivElement>>) {
    const children = React.Children.toArray(div.props.children);
    if (React.isValidElement(children[2])) {
      setInputs([...inputs, children[2]]);
      children[2].props;
    }
    return div;
  }


  return (
    <html style={{ backgroundColor: ""}}>
      <style>
        p {
          
        }
      </style>
      <body>
        <div style={{ backgroundColor: "blue", height: ""}}>

          <div style={{backgroundColor: "#242424", height: "100%", }}> 

            <Nav></Nav>

            <h1 className="text-white text-3xl text-center font-bold" style={{height: "60px", display: "flex", alignItems: "center", justifyContent: "center"}}>
              Aiden's cool dashboard
            </h1>

            <div style={{backgroundColor: "red", display: "flex", gap: "20px", height: "60px", alignItems: "center", padding: 10}}>
              
            <button onClick={() => addTest()}><p style={{fontSize: "15px",}}>Add Section</p></button>
            <button onClick={() => deleteTest(test.length - 1)}>
              <p style={{fontSize: "15px"}}>Delete Section</p>
            </button>
            <input value={asd} onChange={(e) => setasd(e.target.value)}></input>

            </div>

            <div style={{backgroundColor: "blue", display: "flex", alignItems: "center", flexDirection: "column", gap: "20px", padding: 10}}>
              {test.map((item, i) => (
                  <React.Fragment key={i}>
                    {addDiv(item.div)}
                    <p>{childStates[i]}</p>
                  </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <Footer/>
      </body>
    </html>
  );
}