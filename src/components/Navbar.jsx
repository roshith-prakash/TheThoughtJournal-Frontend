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
import { FaUserPlus } from "react-icons/fa6";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  const { dbUser } = useDBUser();

  return (
    <>
      <div
        className={`sticky top-0 w-full font-inter shadow-md overflow-hidden bg-white flex justify-between items-center px-5 lg:px-10 py-5 z-10 max-w-screen`}
      >
        {/* Logo on the left side - linked to home page */}
        <Link className="flex items-center gap-x-2" to="/">
          <img
            src={logo}
            alt="The Thought Journal"
            className="h-6 w-6 md:h-10 md:w-10 cursor-pointer bg-transparent -translate-y-0.5"
          ></img>
          <p className="gmx-2 italic font-medium text-base  md:text-lg text-ink transition-all">
            The Thought Journal
          </p>
        </Link>

        {/* Links at the right side - displayed on larger screens */}
        <div className="flex gap-x-5 lg:gap-x-8 font-medium items-center">
          {/* Search Icon - takes to search page. */}
          <Link to="/search">
            <IoSearch className="text-3xl hover:text-cta transition-all" />
          </Link>

          {/* Link to create post page */}
          {location.pathname != "/addPost" && (
            <Link to="/addPost" className="hidden lg:block">
              <CTAButton text={"Create a Post"} />
            </Link>
          )}

          {/* Link to signup page */}
          {!currentUser && (
            <Link to="/signup" className="hidden lg:block">
              Sign up
            </Link>
          )}

          {/* Link to login page */}
          {!currentUser && (
            <Link to="/login" className="hidden lg:block">
              Login
            </Link>
          )}

          {/* Contains Popup for account & Hamburger button. */}
          <div className="flex items-center gap-x-5">
            <Popover>
              <PopoverTrigger className="flex items-center">
                {dbUser?.photoURL ? (
                  <div className=" bg-gradient-to-br  from-[#ec8cff] to-cta rounded-full p-1 flex items-center justify-center">
                    <img
                      src={dbUser?.photoURL}
                      className="rounded-full h-9 w-9 border-2 border-white"
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
                <div className="py-1 min-w-48 flex flex-col gap-y-1">
                  {/* View Profile */}
                  {dbUser && (
                    <>
                      <Link
                        to="/profile"
                        className={`flex flex-col gap-y-2 font-medium text-cta hover:bg-slate-50 hover:text-hovercta text-lg py-2 px-5 rounded  w-full transition-all`}
                      >
                        <p className="text-center">{dbUser?.name}</p>
                        <p className="text-center">@{dbUser?.username}</p>
                      </Link>

                      <hr />
                    </>
                  )}

                  {/* Edit Profile */}
                  {dbUser && (
                    <>
                      <NavLink
                        to="/editProfile"
                        className={({ isActive, isPending }) =>
                          `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full transition-all ${
                            isActive && "bg-slate-100"
                          }`
                        }
                      >
                        <CgProfile className="text-xl" />
                        Edit Profile
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
                          `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full transition-all ${
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
                          `flex gap-x-5 items-center font-medium bg-purple-100 text-lg py-2 px-5 rounded w-full transition-all ${
                            isActive && "bg-slate-100"
                          }`
                        }
                      >
                        <RiAccountPinCircleLine className="text-xl animate-pulse" />
                        <p className="animate-pulse">Profile</p>
                      </NavLink>
                      <hr />
                    </>
                  )}

                  {/* Log Out */}
                  {currentUser && (
                    <NavLink
                      to="/signout"
                      className={({ isActive, isPending }) =>
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full transition-all ${
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
                          `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full transition-all ${
                            isActive && "bg-slate-100"
                          }`
                        }
                      >
                        <FaUserPlus className="text-xl" />
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
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 w-full transition-all ${
                          isActive && "bg-slate-100"
                        }`
                      }
                    >
                      <CgLogOut className="text-xl rotate-180" />
                      Login
                    </NavLink>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="lg:hidden flex items-center gap-x-5">
              <RxHamburgerMenu
                onClick={() => setOpen(true)}
                className="cursor-pointer text-xl text-ink"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pop out div - displayed when hamburger is clicked  */}
      <div
        className={`lg:hidden h-screen w-full text-xl md:text-lg fixed top-0 right-0 z-10 bg-white pb-6 text-center shadow-md ${
          open ? "translate-x-0" : "translate-x-[100%]"
        } transition-all duration-500`}
      >
        <div className="flex justify-between items-center pt-8 px-5 mb-14">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 md:h-10 md:w-10 cursor-pointer bg-transparent -translate-y-0.5"
            ></img>
            <p className="mx-2 italic font-medium text-lg  md:text-lg text-ink transition-all">
              The Thought Journal
            </p>
          </div>
          {/* Close drawer */}
          <RxCross2
            onClick={() => setOpen(false)}
            className="cursor-pointer text-2xl text-ink"
          />
        </div>
        <div className="px-8 mt-20 text-2xl flex flex-col gap-y-3">
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

          {/* Link to login page */}
          {dbUser && (
            <p className="my-2">
              <Link
                to="/profile"
                className="hover:text-cta cursor-pointer transition-all"
              >
                My Profile
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
        </div>
      </div>
    </>
  );
};

export default Navbar;
