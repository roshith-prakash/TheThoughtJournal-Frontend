import React from "react";
import logo from "../assets/logo.jpg";

const Footer = () => {
  return (
    <div className="border-2 border-[#efebd9] bg-white">
      <div className="px-5 flex items-center gap-x-4 py-10">
        <img src={logo} className="h-32" />
        <h2 className="text-4xl font-semibold italic text-blueink">
          The Thought Journal
        </h2>
      </div>
    </div>
  );
};

export default Footer;
