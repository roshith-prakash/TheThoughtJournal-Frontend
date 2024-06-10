import React from "react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-white mt-10">
      <div className="md:px-5 flex flex-col justify-center items-center gap-y-5 py-5">
        <img src={logo} className="h-20 md:h-24 lg:h-32" />
        <h2 className="text-2xl md:text-4xl font-semibold text-ink">
          The Thought Journal
        </h2>
      </div>

      {/* <div className="py-3">
        <div className="flex flex-col gap-y-2 text-blueink">
          <Link to="/">Home</Link>
          <Link to="/addPost">Create Post</Link>
          <Link to="/posts">Posts</Link>
        </div>
      </div> */}

      <div className="py-5 text-sm font-medium md:text-xl flex justify-center gap-x-1">
        <p> &copy; Roshith Prakash.</p>
        <p>2024.</p>
        <p>All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
