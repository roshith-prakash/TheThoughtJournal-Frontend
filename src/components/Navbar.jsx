import React, { useState } from "react";
// import OutlineButton from "./OutlineButton";
import logo from "../assets/logo.jpeg";
// import CTAButton from "./CTAButton";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
// import { GoDownload } from "react-icons/go";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className={`font-inter ${
          !open && "shadow-md"
        } lg:shadow-md flex justify-between items-center px-10 py-5`}
      >
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12 w-12 cursor-pointer"></img>
        </Link>
        <div className="hidden lg:flex gap-x-8 font-medium items-center">
          <Link
            to="/"
            className="hover:text-cta cursor-pointer  transition-all"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-cta cursor-pointer  transition-all"
          >
            About Me
          </Link>
          <Link
            to="/projects"
            className="hover:text-cta cursor-pointer  transition-all"
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className="hover:text-cta cursor-pointer  transition-all"
          >
            Contact
          </Link>
          {/* <OutlineButton
            onClick={() => {
              window.open("roshithprakash_resume.pdf");
            }}
            text={
              <div className="flex gap-x-2 items-center">
                Resume
                <GoDownload className="text-lg" />
              </div>
            }
          /> */}
        </div>
        <div className="lg:hidden">
          {open ? (
            <RxCross2
              onClick={() => setOpen(false)}
              className="cursor-pointer text-xl"
            />
          ) : (
            <RxHamburgerMenu
              onClick={() => setOpen(true)}
              className="cursor-pointer text-xl"
            />
          )}
        </div>
      </div>

      {open && (
        <div className="lg:hidden text-xl md:text-lg absolute w-full z-10 bg-white px-5 pb-6 text-center shadow-md">
          <p className="my-2">
            <Link
              to="/"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Home
            </Link>
          </p>
          <p className="my-2">
            <Link
              to="/about"
              className="hover:text-cta cursor-pointer transition-all"
            >
              About Me
            </Link>
          </p>
          <p className="my-2">
            <Link
              to="/projects"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Projects
            </Link>
          </p>
          <p className="my-2">
            <Link
              to="/contact"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Contact
            </Link>
          </p>
          <br />
          {/* <CTAButton
            onClick={() => {
              window.open("roshithprakash_resume.pdf");
            }}
            text={
              <div className="flex gap-x-2 items-center">
                Resume
                <GoDownload className="text-lg" />
              </div>
            }
          /> */}
        </div>
      )}
    </>
  );
};

export default Navbar;
