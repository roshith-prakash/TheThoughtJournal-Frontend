import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import { checkVerified } from "../functions/checkVerified";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { currentUser } = useAuth();

  console.log("CurrentUser", currentUser);
  console.log("Is user verified", checkVerified());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return axiosInstance.get("/post/get-recent-posts");
    },
  });

  console.log(data);

  return (
    <>
      <Navbar />
      <div className="p-5">Home</div>
      <div>
        {isLoading && <p>Loading</p>}
        {error && <p>Error</p>}

        {data &&
          data?.data?.posts?.map((post, index) => {
            return (
              <div className="my-5" key={index}>
                <p>{post?.title}</p>
                <p>{post?.User?.name ? post?.User?.name : "Anonymous"}</p>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Home;
