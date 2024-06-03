import { Navbar, OutlineButton } from "../components";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logout from "../assets/think.jpg";

const Signout = () => {
  const navigate = useNavigate();

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
        <h1 className="text-2xl lg:text-xl font-medium">
          Do you want to sign out?
        </h1>
        <img src={logout} className="max-w-[35%] lg:max-w-[20%]" />
        <div className="w-[30%] lg:w-[10%]">
          <OutlineButton onClick={handleLogout} text={"Sign Out"} />
        </div>
      </div>
    </>
  );
};

export default Signout;
