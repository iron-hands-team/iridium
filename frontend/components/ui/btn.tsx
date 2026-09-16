"use client";

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
};


function Btn({onClick , children} : ButtonProps) {
  return <button 
  style={{backgroundColor: "#535353", width: "120px", height: "30px", borderRadius: "10px"
  }}
  onClick={onClick}
  >
    {children}
  </button>;
}

export default Btn;
