import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { Navbar } from "../components/index";

const User = () => {
  // Get Post Id from params.
  let { username } = useParams();

  // Fetch data from server.
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      return axiosInstance.post("/auth/get-user-info", { username: username });
    },
  });

  console.log(data);

  if (error) {
    console.log(error?.response?.data?.data);
  }

  return (
    <div>
      <Navbar />
      User
      <div className="mt-20 px-5">
        {error && "User not found."}

        {data && data?.data?.user?.name}
      </div>
    </div>
  );
};

export default User;
