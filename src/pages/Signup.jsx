import React from "react";
import { CTAButton, Input, Navbar } from "../components";
import google from "../assets/google.png";

const Signup = () => {
  return (
    <>
      <Navbar />

      <div className="lg:min-h-[89vh] flex w-full">
        {/* Left Div */}
        <div className="flex-1 h-[100%] flex justify-center items-center pb-10">
          {/* Signup Form Div */}
          <div className="mt-5 p-5 px-20 shadow-xl rounded-xl pb-10">
            {/* Title */}
            <h1 className="font-bold text-2xl italic text-center">
              Sign Up to The Journal
            </h1>

            {/* Email Input field */}
            <div className="mt-8 px-2">
              <p className="font-medium">Email</p>
              <Input placeholder={"Enter your email address"} />
            </div>

            {/* Password Input field */}
            <div className="mt-6 px-2">
              <p className="font-medium">Password</p>
              <Input placeholder={"Enter your password"} />
            </div>

            {/* Confirm Password Input field */}
            <div className="mt-6 px-2">
              <p className="font-medium">Confirm Password</p>
              <Input placeholder={"Confirm your password"} />
            </div>

            {/* Submit Button */}
            <div className="mt-12">
              <CTAButton text={"Sign Up"} />
            </div>

            {/* OR */}
            <div className="flex mt-10 mb-5 items-center">
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
              <p className="text-center px-2 font-semibold text-greyText">OR</p>
              <div className="flex-1 h-0 border-[1px] border-greyText"></div>
            </div>

            {/* Google Sign Up Button */}
            <button className="flex gap-x-5 py-4 justify-center items-center px-14 shadow-md rounded-lg font-medium active:shadow transition-all">
              <p>Sign up with google</p>
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
