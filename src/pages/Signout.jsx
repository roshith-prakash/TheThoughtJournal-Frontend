import { Navbar, OutlineButton } from "../components";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logout from "../assets/signout.jpg";
import { useEffect } from "react";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      <div className="min-h-[89vh] py-20 gap-10 flex flex-col justify-center items-center">
        <h1 className="text-3xl lg:text-4xl font-medium">
          Do you want to log out?
        </h1>
        <img
          src={logout}
          className="max-w-[35%] lg:max-w-[20%] pointer-events-none"
        />
        <div className="w-[30%] lg:w-[10%]">
          <OutlineButton onClick={handleLogout} text={"Log Out"} />
        </div>
      </div>
    </>
  );
};

export default Signout;
