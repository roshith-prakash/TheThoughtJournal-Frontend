import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { BsPen } from "react-icons/bs";
import { useAuth } from "../context/authContext";
// @ts-expect-error import image
import footerlogo from "../assets/footerlogo.png";

const Footer = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const year = new Date().getFullYear();

  return (
    <footer className="relative font-navigation text-white">
      {/* Floating CTA Card */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[90vw] md:w-[85vw] lg:w-[80vw] bg-gradient-to-r from-darkgrey to-darkgrey/90 rounded-xl shadow-lg border border-white/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl md:text-2xl font-semibold">
              Have a thought to share?
            </h3>
            <p className="text-white/70 mt-1 text-sm">
              Join the conversation and express yourself
            </p>
          </div>
          <button
            onClick={() => navigate("/addPost")}
            className="px-6 py-3 flex items-center gap-x-2 font-medium text-white bg-gradient-to-r from-cta/80 to-cta hover:from-cta hover:to-cta/90 transition-all rounded-full shadow-md"
          >
            <BsPen className="text-lg" />
            Create a Post!
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-darkbg/95 pt-28 pb-8 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-x-3 mb-4">
                <img
                  src="https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738811/logo_wbqnwt.png"
                  alt="The Thought Journal Logo"
                  className="h-14"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2 font-blogTitle tracking-wider">
                The Thought Journal
              </h2>
              <p className="text-white/70 text-sm mb-6">
                "Thoughts That Inspire and Enlighten"
              </p>
              <p className="text-sm text-white/80 max-w-xs text-center md:text-left">
                A platform dedicated to sharing meaningful thoughts, ideas, and
                perspectives that spark conversation and inspire change.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2 w-full text-center md:text-left">
                Quick Links
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="hover:text-darkmodeCTA transition-all">
                  Home
                </Link>
                <Link
                  to="/search"
                  className="hover:text-darkmodeCTA transition-all"
                >
                  Search
                </Link>
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="hover:text-darkmodeCTA transition-all"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/addPost"
                      className="hover:text-darkmodeCTA transition-all"
                    >
                      Create Post
                    </Link>
                    <Link
                      to="/signout"
                      className="hover:text-darkmodeCTA transition-all"
                    >
                      Log Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="hover:text-darkmodeCTA transition-all"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      className="hover:text-darkmodeCTA transition-all"
                    >
                      Login
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Connect Section */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2 w-full text-center md:text-left">
                Connect With Us
              </h3>
              <div className="flex gap-4 mb-6">
                <a
                  href="https://github.com/roshith-prakash"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-darkgrey/50 hover:bg-white text-white hover:text-darkgrey transition-all rounded-full border border-white/20"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-xl" />
                </a>
                <a
                  href="https://www.linkedin.com/in/roshith-prakash/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-darkgrey/50 hover:bg-white text-white hover:text-darkgrey transition-all rounded-full border border-white/20"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </a>
                <a
                  href="mailto:roshithprakash07@gmail.com"
                  className="p-3 bg-darkgrey/50 hover:bg-white text-white hover:text-darkgrey transition-all rounded-full border border-white/20"
                  aria-label="Email"
                >
                  <FaEnvelope className="text-xl" />
                </a>
              </div>
              <div className="hidden lg:block">
                <img
                  src={footerlogo || "/placeholder.svg"}
                  alt="Footer illustration"
                  className="h-40 opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/80">
              © {year} The Thought Journal. All rights reserved.
            </p>
            <p className="text-sm text-white/80 mt-2 md:mt-0">
              Developed with 💜 by Roshith Prakash.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
