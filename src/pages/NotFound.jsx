import React, { useEffect } from "react";
import { Footer, Navbar, OutlineButton } from "../components";
import { useNavigate } from "react-router-dom";

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
      <div className="min-h-[60vh] flex items-center justify-center pt-20 pb-32">
        <div>
          <p className="text-4xl px-5 text-center mt-14">
            I think we are lost. Let's go back?
          </p>
          <div className="mt-10 flex justify-center">
            <OutlineButton onClick={() => navigate("/")} text="Go Back Home" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
