import { Navbar } from "../components";
import { useDBUser } from "../context/userContext";

const Profile = () => {
  const { dbUser } = useDBUser();

  return (
    <>
      <Navbar />
      <div className="lg:min-h-[89vh]  flex w-full">{dbUser?.name}</div>;
    </>
  );
};

export default Profile;
