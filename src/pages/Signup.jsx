import React, { useEffect, useState } from "react";
import {
  ErrorStatement,
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
import { isValidPassword, isValidEmail } from "../functions/regexFunctions";

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle Email Signup
  const handleEmailSignup = () => {
    setError({
      email: 0,
      pw: 0,
      confirmpw: 0,
    });

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

        // Add user in DB
        axiosInstance
          .post("/auth/create-user", {
            user: user,
          })
          .then((res) => {
            // Send email verification link.
            sendEmailVerification(user).then((res) => {
              toast.success("Profile Created.");
              toast("Email Verification Link sent.");
              // Enable button
              setDisabled(false);
              // Navigate to home
              setTimeout(() => navigate("/"), 4000);
            });
          })
          .catch((err) => {
            // Display error
            toast.error("Something went wrong!");
            // Enable button
            setDisabled(false);
          });
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
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Add user in DB
        axiosInstance
          .post("/auth/create-user", {
            user: user,
          })
          .then((res) => {
            navigate("/");
          })
          .catch((err) => {
            // Display error
            toast.error("Something went wrong!");
            // Enable button
            setDisabled(false);
          });
      })
      .catch((error) => {
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
      <div className="lg:min-h-[89vh] flex w-full">
        {/* Left Div */}
        <div className="bg-paper min-h-[88vh] pb-10 bg-cover lg:bg-none lg:bg-[#fcfafa] flex-1 h-[100%] flex justify-center items-center">
          {/* Signup Form Div */}
          <div className="bg-white w-[65%] mt-5 p-5 px-20 shadow-xl rounded-xl pb-10">
            {/* Title */}
            <h1 className="text-ink font-bold text-2xl italic text-center">
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
        <div className="flex-1 bg-signup bg-cover origin-center hidden lg:block"></div>
      </div>
    </>
  );
};

export default Signup;
