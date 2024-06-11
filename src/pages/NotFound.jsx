import { useEffect } from "react";
import { Footer, Navbar, OutlineButton } from "../components";
import { useNavigate } from "react-router-dom";
import notfound from "../assets/notfound.svg";

const NotFound = () => {
  const navigate = useNavigate();

  // Scroll to top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
        <div>
          {/* Title for page */}
          <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
            I think we are lost. Let's go back?
          </p>
          <div className="mt-10 flex flex-col gap-10 justify-center items-center">
            {/* Image */}
            <img
              src={notfound}
              className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
            />
            {/* Button to navigate back to home page */}
            <div className="w-[40%] lg:w-[30%]">
              <OutlineButton
                onClick={() => navigate("/")}
                text="Go Back Home"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden pt-20 lg:block">
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
