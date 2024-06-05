import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import { checkVerified } from "../functions/checkVerified";

const Home = () => {
  const { currentUser } = useAuth();

  console.log("CurrentUser", currentUser);
  console.log("Is user verified", checkVerified());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-5">Home</div>
    </>
  );
};

export default Home;
