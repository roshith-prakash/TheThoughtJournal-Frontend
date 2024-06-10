import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useDBUser } from "../context/userContext";
import { Navbar, OutlineButton } from "../components";
import notfound from "../assets/notfound.svg";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { auth } from "../firebase/firebase";

const Onboarding = () => {
  const navigate = useNavigate();
  // Db user object
  const { dbUser } = useDBUser();
  // Firebase user object
  const { currentUser } = useAuth();

  // Name of the user to be stored in DB
  const [name, setName] = useState(currentUser?.displayName);
  // Profile image of user
  const [image, setImage] = useState(currentUser?.photoURL);
  // Bio of the user
  const [bio, setBio] = useState();
  // Username to be stored in DB
  const [username, setUsername] = useState();

  console.log("Firebase user", currentUser);
  console.log("DB USER", dbUser);

  // Set window title.
  useEffect(() => {
    document.title = "Onboarding | The Thought Journal";
  }, []);

  const sendVerification = () => {
    const user = auth.currentUser;
    sendEmailVerification(user)
      .then((res) => {
        toast("Email Verification Link sent.");
      })
      .catch((err) => {
        toast.error("Something went wrong.");
      });
  };

  if (dbUser) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              You have already created your profile!
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
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              You have not signed in!
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
                  onClick={() => navigate("/signup")}
                  text="Sign Up"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser?.emailVerified) {
    return (
      <div>
        <Navbar />
        <Toaster />
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              Oops! Your email isn't verified.
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
                  onClick={sendVerification}
                  text="Resend Verification Link"
                />
              </div>
              <div className="w-[40%] lg:w-[30%]">
                <OutlineButton
                  onClick={() => window.location.reload()}
                  text={
                    <>
                      <p>Already verified?</p>
                      <p> Reload the page</p>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Onboarding required.</div>;
};

export default Onboarding;
