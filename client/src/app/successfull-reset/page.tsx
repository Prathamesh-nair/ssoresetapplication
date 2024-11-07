import HeaderSection from "@/components/HeaderSection";
import Logo from "@/components/Logo";
import React from "react";

const page = () => {
  return (
    <div className="h-screen flex">
      {/* LEFT SIDE */}
      <div className="flex flex-col items-center justify-evenly w-1/2 relative">
        <Logo />
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-[#2D51FF] w-1/2 flex flex-col items-center justify-center rounded-tl-[100px] rounded-bl-[100px] p-10 relative">
        <HeaderSection title="Password Reset Successfully" />
      </div>
    </div>
  );
};

export default page;
