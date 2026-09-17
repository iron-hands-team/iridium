import Footer from "../components/layout/footer";
import Btn from "@/components/ui/btn";
import Nav from "@/components/layout/nav";
import DashboardBody from "@/components/layout/DashboardBody";


// my plan is to create a simple database first
// this database stores attendee's info
// then loads here
// the class is temporary



export default function Home() {

  return (
    <html style={{ backgroundColor: "black"}}>

      <body>

        <div style={{ backgroundColor: "#2e2e2e", height: ""}}>

          <div style={{backgroundColor: "#413434", height: "100%", }}> 

            <Nav></Nav>

            <h1 className="text-white text-3xl text-center font-bold" style={{height: "60px", display: "flex", alignItems: "center", justifyContent: "center"}}>
              Math Class Dashboard
            </h1>

            <DashboardBody/>
          </div>
        </div>
        <Footer/>
      </body>
    </html>
  );
}