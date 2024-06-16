import { Footer, Navbar, OutlineButton } from "../components";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logout from "../assets/signout.svg";
import { useEffect } from "react";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Logout | The Thought Journal";
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Navbar />

      <div className="min-h-[89vh] py-16 gap-10 flex flex-col justify-center items-center pb-24">
        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-medium">
          Do you want to log out?
        </h1>
        {/* Image */}
        <img
          src={logout}
          className="max-w-[35%] lg:max-w-[20%] pointer-events-none"
        />
        {/* Button to log out */}
        <div className="w-[30%] lg:w-[10%]">
          <OutlineButton onClick={handleLogout} text={"Log Out"} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signout;
