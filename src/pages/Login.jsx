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
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import google from "../assets/google.png";
import { isValidEmail, isValidPassword } from "../functions/regexFunctions";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "../utils/axios";

const provider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: 0,
    pw: 0,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Login | The Thought Journal";
  }, []);

  // Login using email and password
  const handleLogin = () => {
    setError({
      email: 0,
      pw: 0,
    });

    // Check if email has been entered
    if (email == null || email == undefined || email.length == 0) {
      setError((prev) => ({ ...prev, email: 1 }));
      return;
    }
    // Check if email is a valid email
    else if (!isValidEmail(email)) {
      setError((prev) => ({ ...prev, email: 2 }));
      return;
    }
    // Check if password has been entered
    else if (
      password == null ||
      password == undefined ||
      password.length == 0
    ) {
      setError((prev) => ({ ...prev, pw: 1 }));
      return;
    }
    // Check if password is a valid password
    else if (!isValidPassword(password)) {
      setError((prev) => ({ ...prev, pw: 2 }));
      return;
    }

    // Disable buttons
    setDisabled(true);

    // Sign in using firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setDisabled(false);
        navigate("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setDisabled(false);
        // Display invalid credentials toast error
        if (String(errorMessage).includes("(auth/invalid-credential)")) {
          toast.error("Invalid Credentials.");
        }
        // Display error
        else {
          toast.error("Something went wrong.");
        }
      });
  };

  // Login using google
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Add user in DB if not already present
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
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="lg:min-h-[89vh]  flex w-full">
        {/* Image Div - displayed only on laptop */}
        <div className="flex-1 min-h-[100%] bg-login bg-cover origin-center hidden lg:block"></div>

        {/* Right Div */}
        <div className="bg-paper min-h-[88vh] pb-10 bg-cover lg:bg-none lg:bg-[#fcfafa] flex-1 h-[100%] flex justify-center items-center">
          {/* Login Form Div */}
          <div className="bg-white w-[65%] mt-14 p-5 px-20 shadow-xl rounded-xl pb-10">
            {/* Title */}
            <h1 className="text-ink font-bold text-2xl mt-5 italic text-center">
              Log in to The Journal
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

            {/* Submit Button */}
            <div className="mt-12">
              <OutlineButton
                onClick={handleLogin}
                disabled={disabled}
                disabledText="Please Wait..."
                text={"Log in"}
              />
            </div>

            {/* OR */}
            <div className="flex mt-10 mb-5 items-center">
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
              <p className="text-center px-2 font-semibold text-greyText">OR</p>
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              disabled={disabled}
              onClick={handleGoogleLogin}
              className="flex w-full gap-x-5 py-4 justify-center items-center px-14 shadow-md rounded-lg font-medium active:shadow transition-all disabled:text-greyText"
            >
              <p>Log in with Google</p>
              <img src={google} className="max-h-6 max-w-6" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
