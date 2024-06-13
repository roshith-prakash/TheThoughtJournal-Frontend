import { useAuth } from "../context/authContext";
import { useDBUser } from "../context/userContext";
import { Navbar, OutlineButton } from "../components";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/firebase";
import notfound from "../assets/notfound.svg";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";

const Protector = ({ children }) => {
  // Navigate function to navigate to different pages.
  const navigate = useNavigate();
  // Firebase User.
  const { currentUser } = useAuth();
  // User object from database.
  const { dbUser } = useDBUser();
  // Loading is false if dbUser is present
  const [loading, setLoading] = useState(dbUser ? false : true);

  // If dbUser is present - directly set loading to false
  // If dbUser is not present - wait for dbUser to be fetched (in case of reloads)
  useEffect(() => {
    if (!dbUser) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } else {
      setLoading(false);
    }
  }, []);

  // To resend email verification link.
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

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <HashLoader
          color={"#9b0ced"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  // If user hasn't signed in using firebase
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

  // If user has signed up via email but has not verified their email.
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

  // If user hasn't onboarded to the site
  if (currentUser && !dbUser) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              You have not finished creating your account!
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
                  onClick={() => navigate("/onboarding")}
                  text="Complete your Profile"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //   If user exists in database
  if (dbUser) {
    return <>{!loading && children}</>;
  }
};

export default Protector;
