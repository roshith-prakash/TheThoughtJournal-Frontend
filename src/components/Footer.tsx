import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { BsPen } from "react-icons/bs";
import { useAuth } from "../context/authContext";

const Footer = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-darkbg/95 dark:border-t-2 font-navigation pb-20 min-h-50vh relative text-white">
        <div className="absolute border-2 border-white/50 dark:border-2 -top-16 w-[90vw] lg:w-[80vw] left-1/2 -translate-x-1/2 rounded-lg h-32 flex flex-col py-2 lg:flex-row justify-around items-center bg-darkgrey text-white">
          <p className="text-xl font-medium">Have a thought to share?</p>
          <button
            onClick={() => navigate("/addPost")}
            className="px-5 flex items-center gap-x-2 py-2 font-medium text-white hover:bg-white hover:text-black transition-all cursor-pointer rounded-full border-2 border-white"
          >
            <BsPen className="text-lg" />
            Create a Post!
          </button>
        </div>

        <div className="pt-32 font-medium flex">
          <div className="flex-1">
            {/* Logo */}
            <div className="flex justify-center items-center gap-x-3">
              <img
                src={
                  "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738811/logo_wbqnwt.png"
                }
                className="h-16"
              />
            </div>
            {/* Title */}
            <p className="mt-5 text-3xl text-center">The Thought Journal</p>
            {/* Subtitle */}
            <p className="text-center mt-3 text-sm">
              &quot;Thoughts That Inspire and Enlighten&quot;
            </p>

            <div className="mt-14 flex justify-center">
              <div className="flex gap-x-5">
                <Link to="/" className="hover:scale-110 transition-all">
                  Home
                </Link>
                {currentUser && (
                  <Link
                    to="/addPost"
                    className="hover:scale-110 transition-all"
                  >
                    Create Post
                  </Link>
                )}

                {!currentUser && (
                  <Link to="/signup" className="hover:scale-110 transition-all">
                    Sign Up
                  </Link>
                )}
                {!currentUser && (
                  <Link to="/login" className="hover:scale-110 transition-all">
                    Login
                  </Link>
                )}
                {currentUser && (
                  <Link
                    to="/signout"
                    className="hover:scale-110 transition-all"
                  >
                    Log Out
                  </Link>
                )}
              </div>
            </div>

            {/* Link */}
            <div className="flex justify-center gap-x-8 mt-14">
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

            <p className="mt-5 text-center">Developed by Roshith Prakash.</p>
          </div>
          <div className="hidden flex-1 lg:flex justify-center items-center">
            <img
              src={
                "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738810/footer_yoppab.svg"
              }
              className="h-60 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
