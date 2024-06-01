import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Editor } from "../components";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navbar />
      <div>Home</div>

      <div className="mt-24">
        <Editor />
      </div>
    </>
  );
};

export default Home;
