import { useState } from "react";
import logo from "../assets/logo.png";
import CTAButton from "./CTAButton";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useDBUser } from "../context/userContext";
import { useLocation, NavLink } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import Avvvatars from "avvvatars-react";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { BsPen } from "react-icons/bs";
import { RiAccountPinCircleLine } from "react-icons/ri";
import defaultAccount from "../assets/account.png";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  const { dbUser } = useDBUser();

  return (
    <>
      <div
        className={`font-inter ${
          !open && "shadow-md"
        } lg:shadow-md bg-white flex justify-between items-center px-5 lg:px-10 py-5 z-2 relative`}
      >
        {/* Logo on the left side - linked to home page */}
        <Link className="flex items-center" to="/">
          <img src={logo} alt="Logo" className="h-10 w-10 cursor-pointer"></img>
          <p className="mx-2 italic font-medium text-lg text-ink">
            The Thought Journal
          </p>
        </Link>

        {/* Links at the right side - displayed on larger screens */}
        <div className="lg:flex gap-x-8 font-medium items-center">
          {/* Link to create post page */}
          {location.pathname != "/addPost" && (
            <Link to="/addPost" className="hidden lg:block">
              <CTAButton text={"Create a Post"} />
            </Link>
          )}

          <Popover>
            <PopoverTrigger className="flex items-center">
              {dbUser?.photoURL ? (
                <div className="border-2 border-cta rounded-full p-1">
                  <img
                    src={dbUser?.photoURL}
                    className="rounded-full h-8"
                  ></img>
                </div>
              ) : (
                <>
                  {dbUser ? (
                    <Avvvatars size={40} value={dbUser?.name} />
                  ) : (
                    <img
                      src={defaultAccount}
                      className="rounded-full h-9"
                    ></img>
                  )}
                </>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto mt-2 mr-4 py-0 px-1">
              <div className="py-1 w-48 flex flex-col gap-y-1">
                {/* Profile */}
                {dbUser && (
                  <>
                    <NavLink
                      to="/profile"
                      className={({ isActive, isPending }) =>
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full ${
                          isActive && "bg-slate-100"
                        }`
                      }
                    >
                      <CgProfile className="text-xl" />
                      Profile
                    </NavLink>
                    <hr />
                  </>
                )}

                {/* Create Post */}
                {dbUser && (
                  <>
                    <NavLink
                      to="/addPost"
                      className={({ isActive, isPending }) =>
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full ${
                          isActive && "bg-slate-100"
                        }`
                      }
                    >
                      <BsPen className="text-lg" />
                      Create a Post
                    </NavLink>
                    <hr />
                  </>
                )}

                {/* Onboarding */}
                {currentUser && !dbUser && (
                  <>
                    <NavLink
                      to="/onboarding"
                      className={({ isActive, isPending }) =>
                        `flex gap-x-5 items-center font-medium bg-purple-100 text-lg py-2 px-5 rounded  w-full ${
                          isActive && "bg-slate-100"
                        }`
                      }
                    >
                      <RiAccountPinCircleLine className="text-xl" />
                      Profile
                    </NavLink>
                    <hr />
                  </>
                )}

                {/* Log Out */}
                {currentUser && (
                  <NavLink
                    to="/signout"
                    className={({ isActive, isPending }) =>
                      `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 transition-all w-full ${
                        isActive && "bg-slate-100"
                      }`
                    }
                  >
                    <CgLogOut className="text-xl" />
                    Log Out
                  </NavLink>
                )}

                {/* Sign up */}
                {!currentUser && (
                  <>
                    <NavLink
                      to="/signup"
                      className={({ isActive, isPending }) =>
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full  ${
                          isActive && "bg-slate-100"
                        }`
                      }
                    >
                      <CgLogOut className="text-xl rotate-180" />
                      Sign Up
                    </NavLink>
                    <hr />
                  </>
                )}

                {/* Log in */}
                {!currentUser && (
                  <NavLink
                    to="/login"
                    className={({ isActive, isPending }) =>
                      `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full ${
                        isActive && "bg-slate-100"
                      }`
                    }
                  >
                    <CgLogOut className="text-xl rotate-180" />
                    Log in
                  </NavLink>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Hamburger button - displayed on smaller screens */}
        {/* <div className="lg:hidden flex items-center gap-x-5">
          {!open && currentUser && (
            <Popover>
              <PopoverTrigger>
                <Avvvatars style="shape" value="tim@apple.com" />
              </PopoverTrigger>
              <PopoverContent>
                <Link to="/signout" className=" cursor-pointer  transition-all">
                  Log Out
                </Link>
              </PopoverContent>
            </Popover>
          )}

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
        </div> */}
      </div>

      {/* Popup div - displayed when hamburger is clicked  */}
      {open && (
        // <div className="lg:hidden text-xl md:text-lg absolute w-full z-10 bg-white px-5 pb-6 text-center shadow-md">
        //   {/* Link to Home */}
        //   <p className="my-2">
        //     <Link
        //       to="/"
        //       className="hover:text-cta cursor-pointer transition-all"
        //     >
        //       Home
        //     </Link>
        //   </p>
        //   {/* Link to create post page - not shown if already on create post page */}
        //   {location.pathname != "/addPost" && (
        //     <p className="my-2">
        //       <Link
        //         to="/addPost"
        //         className="hover:text-cta cursor-pointer transition-all"
        //       >
        //         Create Post
        //       </Link>
        //     </p>
        //   )}
        //   {/* Link to signup page */}
        //   {!currentUser && (
        //     <p className="my-2">
        //       <Link
        //         to="/signup"
        //         className="hover:text-cta cursor-pointer transition-all"
        //       >
        //         Sign up
        //       </Link>
        //     </p>
        //   )}
        //   {/* Link to login page */}
        //   {!currentUser && (
        //     <p className="my-2">
        //       <Link
        //         to="/login"
        //         className="hover:text-cta cursor-pointer transition-all"
        //       >
        //         Log in
        //       </Link>
        //     </p>
        //   )}
        //   {/* Link to logout page */}
        //   {currentUser && (
        //     <p className="my-2">
        //       <Link
        //         to="/signout"
        //         className="hover:text-cta cursor-pointer transition-all"
        //       >
        //         Log Out
        //       </Link>
        //     </p>
        //   )}
        //   <br />
        // </div>
        <></>
      )}
    </>
  );
};

export default Navbar;
