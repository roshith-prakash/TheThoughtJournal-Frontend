import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import footer from "../assets/footer.svg";
import { useNavigate } from "react-router-dom";
import { BsPen } from "react-icons/bs";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-gradient-to-b from-cta to-hovercta font-inter pb-20 min-h-50vh relative text-white">
        <div className="absolute -top-16 w-[90vw] lg:w-[80vw] left-1/2 -translate-x-1/2 rounded-lg h-32 flex flex-col py-2 lg:flex-row justify-around items-center bg-[#1f1e1e] text-white">
          <p className="text-xl font-medium">Have a thought to share?</p>
          <button
            onClick={() => navigate("/addPost")}
            className="px-5 flex items-center gap-x-2 py-2 font-medium text-white hover:bg-white hover:text-black transition-all cursor-pointer rounded-full border-2 border-white"
          >
            <BsPen className="text-lg" />
            Create a Post!
          </button>
        </div>
        <div className="pt-36 font-medium flex">
          <div className="flex-1">
            <p className="text-2xl text-center">
              &#8220;Ad Astra Per Aspera&#8221;
            </p>
            <p className="text-center mt-2 text-xl">
              Learning something new everyday!
            </p>

            <div className="flex justify-center gap-x-8 mt-10">
              <a
                href="https://github.com/roshith-prakash"
                target="_blank"
                rel="noreferrer"
                className="p-3 text-white hover:bg-white hover:text-cta transition-all cursor-pointer rounded-full border-2 border-white"
              >
                <FaGithub className="text-2xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/roshith-prakash/"
                target="_blank"
                rel="noreferrer"
                className="p-3 text-white hover:bg-white hover:text-cta transition-all cursor-pointer rounded-full border-2 border-white"
              >
                <FaLinkedin className="text-2xl" />
              </a>
              <a
                href="mailto:roshithprakash07@gmail.com"
                className="p-3 text-white hover:bg-white hover:text-cta transition-all cursor-pointer rounded-full border-2 border-white"
              >
                <FaEnvelope className="text-2xl" />
              </a>
            </div>

            <p className="mt-14 text-center">Developed by Roshith Prakash.</p>
            <p className="mt-3 text-center">2024.</p>
          </div>
          <div className="hidden flex-1 lg:flex justify-center items-center">
            <img src={footer} className="h-60 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
