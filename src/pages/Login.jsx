import React from "react";
import {
  CTAButton,
  Input,
  Navbar,
  OutlineButton,
  PasswordInput,
} from "../components";
import { auth } from "../firebase/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import google from "../assets/google.png";

const provider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        navigate("/");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };

  return (
    <>
      <Navbar />

      <div className="lg:min-h-[89vh]  flex w-full">
        {/* Image Div - displayed only on laptop */}
        <div className="flex-1 min-h-[100%] bg-login bg-cover origin-center hidden lg:block"></div>

        {/* Right Div */}
        <div className="bg-paper min-h-[88vh] pb-10 bg-cover lg:bg-none lg:bg-[#fcfafa] flex-1 h-[100%] flex justify-center items-center">
          {/* Login Form Div */}
          <div className="bg-white mt-14 p-5 px-20 shadow-xl rounded-xl pb-10">
            {/* Title */}
            <h1 className="text-ink font-bold text-2xl mt-5 italic text-center">
              Log in to The Journal
            </h1>

            {/* Email Input field */}
            <div className="mt-8 px-2">
              <p className="font-medium">Email</p>
              <Input placeholder={"Enter your email address"} />
            </div>

            {/* Password Input field */}
            <div className="mt-6 px-2">
              <p className="font-medium">Password</p>
              <PasswordInput placeholder={"Enter your password"} />
            </div>

            {/* Submit Button */}
            <div className="mt-12">
              <OutlineButton text={"Log in"} />
            </div>

            {/* OR */}
            <div className="flex mt-10 mb-5 items-center">
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
              <p className="text-center px-2 font-semibold text-greyText">OR</p>
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              className="flex gap-x-5 py-4 justify-center items-center px-14 shadow-md rounded-lg font-medium active:shadow transition-all"
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
