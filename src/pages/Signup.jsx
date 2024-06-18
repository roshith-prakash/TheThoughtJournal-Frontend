import { useEffect, useState } from "react";
import {
  ErrorStatement,
  Footer,
  Input,
  Navbar,
  OutlineButton,
  PasswordInput,
} from "../components";
import { auth } from "../firebase/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "../utils/axios";
import signup from "../assets/signup.svg";
import { isValidEmail, isValidPassword } from "../functions/regexFunctions";
import google from "../assets/google.png";

const provider = new GoogleAuthProvider();

const Signup = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    email: 0,
    pw: 0,
    confirmpw: 0,
  });

  // Scroll to top of page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Sign up | The Thought Journal";
  }, []);

  // Handle Email Signup
  const handleEmailSignup = () => {
    setError({
      email: 0,
      pw: 0,
      confirmpw: 0,
    });

    // Validation Checks

    if (email == null || email == undefined || email.length == 0) {
      setError((prev) => ({ ...prev, email: 1 }));
      return;
    } else if (!isValidEmail(email)) {
      setError((prev) => ({ ...prev, email: 2 }));
      return;
    } else if (
      password == null ||
      password == undefined ||
      password.length == 0
    ) {
      setError((prev) => ({ ...prev, pw: 1 }));
      return;
    } else if (!isValidPassword(password)) {
      setError((prev) => ({ ...prev, pw: 2 }));
      return;
    } else if (
      confirmPassword == null ||
      confirmPassword == undefined ||
      confirmPassword.length == 0
    ) {
      setError((prev) => ({ ...prev, confirmpw: 1 }));
      return;
    } else if (password != confirmPassword) {
      setError((prev) => ({ ...prev, confirmpw: 2 }));
      return;
    }

    // Disable button
    setDisabled(true);

    // Create user using firebase auth.
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        // Send verification email
        sendEmailVerification(user).then((res) => {
          toast("Email Verification Link sent.");
          // Enable button
          setDisabled(false);
        });

        navigate("/onboarding");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // Enable button
        setDisabled(false);
        if (String(errorMessage).includes("(auth/email-already-in-use)")) {
          // Display error
          toast.error("Email is already registered!");
        } else {
          // Display error
          toast.error("Something went wrong!");
        }
      });
  };

  // Handle Google Signup
  const handleGoogleSignup = () => {
    setDisabled(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Check if user exists in DB - if yes, send to home - if no, send to onboarding.
        axiosInstance
          .post("/auth/get-current-user", { user: user })
          .then((res) => {
            if (res?.data?.user) {
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            if (err?.response?.data?.data == "User does not exist.") {
              navigate("/onboarding");
            }
          });
      })
      .catch((error) => {
        setDisabled(false);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error("Something went wrong!");
      });
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="lg:min-h-[89vh] flex w-full lg:bg-none lg:bg-bgwhite">
        {/* Left Div */}
        <div className="min-h-[95vh] lg:h-full lg:min-h-[88vh] pb-10 bg-cover  flex-1 flex justify-center items-center">
          {/* Signup Form Div */}
          <div className="bg-white border-[1px] px-8 md:w-[65%] md:mt-5 lg:mt-5 p-5 md:px-20 shadow-xl rounded-xl pb-10">
            {/* Title */}
            <h1 className="text-ink pt-5 font-bold text-2xl italic text-center">
              Sign Up to The Journal
            </h1>

            {/* Email Input field */}
            <div className="mt-8 px-2">
              <p className="font-medium">Email</p>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={"Enter your email address"}
              />
              {error.email == 1 && (
                <ErrorStatement text={"Please enter your email."} />
              )}
              {error.email == 2 && (
                <ErrorStatement text={"Please enter a valid email address."} />
              )}
            </div>

            {/* Password Input field */}
            <div className="mt-6 px-2">
              <p className="font-medium">Password</p>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={"Enter your password"}
              />
              {error.pw == 1 && (
                <ErrorStatement text={"Please enter a password."} />
              )}
              {error.pw == 2 && (
                <ErrorStatement
                  text={
                    "Password must be 8 characters long and must contain an uppercase letter, lowercase letter, number and special character."
                  }
                />
              )}
            </div>

            {/* Confirm Password Input field */}
            <div className="mt-6 px-2">
              <p className="font-medium">Confirm Password</p>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={"Confirm your password"}
              />
              {error.confirmpw == 1 && (
                <ErrorStatement text={"Please re-enter your password."} />
              )}
              {error.confirmpw == 2 && (
                <ErrorStatement text={"Passwords do not match."} />
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-12">
              <OutlineButton
                disabled={disabled}
                disabledText="Please Wait..."
                onClick={handleEmailSignup}
                text={"Sign Up"}
              />
            </div>

            {/* OR */}
            <div className="flex mt-10 mb-5 items-center">
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
              <p className="text-center px-2 font-semibold text-greyText">OR</p>
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
            </div>

            {/* Google Sign Up Button */}
            <button
              disabled={disabled}
              onClick={handleGoogleSignup}
              className="flex w-full gap-x-5 py-4 justify-center items-center px-14 shadow-md rounded-lg font-medium active:shadow transition-all disabled:text-greyText"
            >
              <p>Sign up with Google</p>
              <img src={google} className="max-h-6 max-w-6" />
            </button>
          </div>
        </div>

        {/* Image Div - displayed only on laptop */}
        <div className="hidden lg:flex lg:flex-1  items-center justify-center">
          <img src={signup} className="max-w-[70%]" />
        </div>
      </div>

      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
};

export default Signup;
