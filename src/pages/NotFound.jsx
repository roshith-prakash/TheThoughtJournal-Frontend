import React, { useEffect } from "react";
import { Footer, Navbar, OutlineButton } from "../components";
import { useNavigate } from "react-router-dom";
import logout from "../assets/think.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center pt-12 pb-32">
        <div>
          <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
            I think we are lost. Let's go back?
          </p>
          <div className="mt-10 flex flex-col gap-10 justify-center items-center">
            <img
              src={logout}
              className="max-w-[35%] lg:max-w-[20%] pointer-events-none"
            />
            <div className="w-[40%] lg:w-[30%]">
              <OutlineButton
                onClick={() => navigate("/")}
                text="Go Back Home"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
