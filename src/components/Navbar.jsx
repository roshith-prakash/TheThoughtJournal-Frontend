import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import CTAButton from "./CTAButton";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <>
      <div
        className={`font-inter ${
          !open && "shadow-md"
        } lg:shadow-md bg-white flex justify-between items-center px-5 lg:px-10  py-5 z-2 relative`}
      >
        {/* Logo on the left side - linked to home page */}
        <Link className="flex items-center" to="/">
          <img src={logo} alt="Logo" className="h-12 w-12 cursor-pointer"></img>
          <p className="mx-2 italic font-medium text-lg text-ink">
            The Thought Journal
          </p>
        </Link>

        {/* Links at the right side - displayed on larger screens */}
        <div className="hidden lg:flex gap-x-8 font-medium items-center">
          {/* Link to create post page */}
          {location.pathname != "/addPost" && (
            <Link to="/addPost">
              <CTAButton text={"Create Post"} />
            </Link>
          )}
          {/* Link to signup page */}
          {!currentUser && (
            <Link
              to="/signup"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Sign Up
            </Link>
          )}
          {/* Link to login page */}
          {!currentUser && (
            <Link
              to="/login"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Log in
            </Link>
          )}
          {/* Link to logout page */}
          {currentUser && (
            <Link
              to="/signout"
              className="hover:text-cta cursor-pointer  transition-all"
            >
              Log Out
            </Link>
          )}
          <Popover>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>
        </div>

        {/* Hamburger button - displayed on smaller screens */}
        <div className="lg:hidden flex items-center gap-x-5">
          <Popover>
            <PopoverTrigger>O</PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>

          {open ? (
            <RxCross2
              onClick={() => setOpen(false)}
              className="cursor-pointer text-xl text-ink"
            />
          ) : (
            <RxHamburgerMenu
              onClick={() => setOpen(true)}
              className="cursor-pointer text-xl text-ink"
            />
          )}
        </div>
      </div>

      {/* Popup div - displayed when hamburger is clicked  */}
      {open && (
        <div className="lg:hidden text-xl md:text-lg absolute w-full z-10 bg-white px-5 pb-6 text-center shadow-md">
          {/* Link to Home */}
          <p className="my-2">
            <Link
              to="/"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Home
            </Link>
          </p>
          {/* Link to create post page - not shown if already on create post page */}
          {location.pathname != "/addPost" && (
            <p className="my-2">
              <Link
                to="/addPost"
                className="hover:text-cta cursor-pointer transition-all"
              >
                Create Post
              </Link>
            </p>
          )}
          {/* Link to signup page */}
          {!currentUser && (
            <p className="my-2">
              <Link
                to="/signup"
                className="hover:text-cta cursor-pointer transition-all"
              >
                Sign up
              </Link>
            </p>
          )}
          {/* Link to login page */}
          {!currentUser && (
            <p className="my-2">
              <Link
                to="/login"
                className="hover:text-cta cursor-pointer transition-all"
              >
                Log in
              </Link>
            </p>
          )}
          {/* Link to logout page */}
          {currentUser && (
            <p className="my-2">
              <Link
                to="/signout"
                className="hover:text-cta cursor-pointer transition-all"
              >
                Log Out
              </Link>
            </p>
          )}
          <br />
        </div>
      )}
    </>
  );
};

export default Navbar;
