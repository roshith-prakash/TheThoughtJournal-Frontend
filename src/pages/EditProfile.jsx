import { useDBUser } from "../context/userContext";
import { Footer, Navbar } from "../components";
import { useEffect } from "react";

const EditProfile = () => {
  // Get database user
  const { dbUser } = useDBUser();

  // Set window title.
  useEffect(() => {
    document.title = `Edit Profile | The Thought Journal`;
  }, []);

  return (
    <>
      <Navbar />
      <div className="lg:min-h-screenbg-bgwhite w-full pb-20">Edit Profile</div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </>
  );
};

export default EditProfile;
