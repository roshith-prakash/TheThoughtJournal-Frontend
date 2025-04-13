import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authContext";
import { useDBUser } from "../context/userContext";
import { CTAButton, ErrorStatement, Input, OutlineButton } from "../components";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { auth } from "../firebase/firebase";
import { IoCloudUploadOutline } from "react-icons/io5";
import { axiosInstance } from "../utils/axios";
import { isValidUsername } from "../functions/regexFunctions";
import { MdOutlineAccountCircle } from "react-icons/md";

const Onboarding = () => {
  // Navigate function to navigate to different pages.
  const navigate = useNavigate();
  // Db user object
  const { dbUser, fetchUser } = useDBUser();
  // Firebase user object
  const { currentUser } = useAuth();
  // Ref for file input
  const fileRef = useRef<HTMLInputElement | null>();
  // Name of the user to be stored in DB
  const [name, setName] = useState("");
  // Profile image of user
  const [image, setImage] = useState();
  // Bio of the user
  const [bio, setBio] = useState("");
  // Username to be stored in DB
  const [username, setUsername] = useState("");
  // To disable button
  const [disabled, setDisabled] = useState(false);
  // Error
  const [error, setError] = useState({
    name: 0,
    username: 0,
  });

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Onboarding | The Thought Journal";
  }, []);

  // To set default values.
  useEffect(() => {
    if (currentUser) {
      setName(currentUser?.displayName);
      setImage(currentUser?.photoURL);
    }
  }, [currentUser]);

  // Set the received image in the state.
  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
    fileRef.current.value = null;
  };

  // To resend email verification link.
  const sendVerification = () => {
    const user = auth.currentUser;
    sendEmailVerification(user)
      .then(() => {
        toast("Email Verification Link sent.");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      });
  };

  // Submit the data to the server to create the user object.
  const handleSubmit = () => {
    setError({
      name: 0,
      username: 0,
    });

    if (name == null || name == undefined || name.length <= 0) {
      setError((prev) => ({ ...prev, name: 1 }));
      return;
    } else if (name.length > 30) {
      setError((prev) => ({ ...prev, name: 2 }));
      return;
    } else if (
      username == null ||
      username == undefined ||
      username.length <= 0
    ) {
      setError((prev) => ({ ...prev, username: 1 }));
      return;
    } else if (username.length > 20) {
      setError((prev) => ({ ...prev, username: 3 }));
      return;
    } else if (!isValidUsername(username)) {
      setError((prev) => ({ ...prev, username: 4 }));
      return;
    }

    setDisabled(true);

    // Check if username is already in use.
    axiosInstance
      .post("/auth/checkUsername", { username: username })
      .then((res) => {
        // If username already exists - show an error
        if (res.data?.exists) {
          setDisabled(false);
          setError((prev) => ({ ...prev, username: 2 }));
          return;
        }
        // If username is available
        else {
          // Create formdata instance
          const formData = new FormData();

          // If image is added - add a file
          if (typeof image != "string") {
            formData.append("file", image);
          }

          // Add details in the user object
          const obj = {
            ...currentUser,
            bio: bio,
            username: username,
            name: name,
            image: typeof image == "string" ? image : null,
          };

          // Append the new user object in formdata
          formData.append("user", JSON.stringify(obj));

          // Add user in DB
          axiosInstance
            .post("/auth/create-user", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then(() => {
              setDisabled(false);
              fetchUser();
              navigate("/");
            })
            .catch(() => {
              // Display error
              toast.error("Something went wrong!");
              // Enable button
              setDisabled(false);
            });
        }
      })
      .catch((err) => {
        setDisabled(false);
        toast.error("Something went wrong.");
        console.log(err);
        return;
      });
  };

  // If user hasn't signed in using firebase
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
        <div>
          {/* Title for page */}
          <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
            You have not signed in!
          </p>
          <div className="mt-10 flex flex-col gap-10 justify-center items-center">
            {/* Image */}
            <img
              src={
                "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738810/notfound_eqfykw.svg"
              }
              className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
            />
            {/* Button to navigate back to home page */}
            <div className="w-[40%] lg:w-[30%]">
              <OutlineButton
                onClick={() => navigate("/signup")}
                text="Sign Up"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has signed up via email but has not verified their email.
  if (!currentUser?.emailVerified) {
    return (
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
        <div>
          {/* Title for page */}
          <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
            Oops! Your email isn&apos;t verified.
          </p>
          <div className="mt-10 flex flex-col gap-10 justify-center items-center">
            {/* Image */}
            <img
              src={
                "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738810/notfound_eqfykw.svg"
              }
              className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
            />
            {/* Button to navigate back to home page */}
            <div className="w-[40%] lg:w-[30%]">
              <OutlineButton
                onClick={sendVerification}
                text="Resend Verification Link"
              />
            </div>
            <div className="w-[40%] lg:w-[30%]">
              <OutlineButton
                onClick={() => window.location.reload()}
                text={
                  <div className="flex flex-col">
                    <p>Already verified?</p>
                    <p> Reload the page</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user already exists
  if (dbUser) {
    return (
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
        <div>
          {/* Title for page */}
          <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
            You have already created your profile!
          </p>
          <div className="mt-10 flex flex-col gap-10 justify-center items-center">
            {/* Image */}
            <img
              src={
                "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738810/notfound_eqfykw.svg"
              }
              className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
            />
            {/* Button to navigate back to home page */}
            <div className="w-[40%] lg:w-[30%]">
              <OutlineButton
                onClick={() => navigate("/")}
                text="Go Back Home"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If onboarding process was left.
  return (
    <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
      <div className="bg-white dark:bg-darkgrey dark:text-darkmodetext border-[1px] px- w-[90%] md:w-[65%] md:mt-5 lg:mt-5 p-5 md:px-20 shadow-xl rounded-2xl pb-10">
        {/* Title */}
        <h1 className="text-ink dark:text-darkmodetext pt-5 font-bold text-2xl text-center">
          Set up your Journal Account!
        </h1>

        <div className="mt-10 flex flex-col gap-y-5">
          <input
            className="hidden"
            type="file"
            ref={fileRef}
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleFileChange}
          />
          <div className="flex justify-center">
            {image ? (
              <img
                src={
                  typeof image == "string" ? image : URL.createObjectURL(image)
                }
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <MdOutlineAccountCircle className="text-[8rem]" />
              // <img src={defaultAccount} className="h-24 w-24 rounded-full" />
            )}
          </div>
          <button
            onClick={() => fileRef.current.click()}
            className="flex justify-center items-center gap-x-2"
          >
            Upload <IoCloudUploadOutline className="translate-y-0.5" />
          </button>
        </div>

        {/* Name & Username */}
        <div className="mt-14 flex flex-col gap-y-8 lg:flex-row lg:gap-x-5">
          {/* Name Input field */}
          <div className="lg:flex-1 px-2">
            <p className="font-medium">Name</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={"Enter your name"}
            />
            {error.name == 1 && (
              <ErrorStatement text={"Please enter your name."} />
            )}
            {error.name == 2 && (
              <ErrorStatement text={"Name cannot exceed 30 characters."} />
            )}
          </div>

          {/* Username Input field */}
          <div className="lg:flex-1 px-2">
            <p className="font-medium">Username</p>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={"Enter a username"}
            />
            {error.username == 1 && (
              <ErrorStatement text={"Please enter a username."} />
            )}
            {error.username == 2 && (
              <ErrorStatement text={"Username already exists."} />
            )}
            {error.username == 3 && (
              <ErrorStatement text={"Username cannot exceed 20 characters."} />
            )}
            {error.username == 4 && (
              <ErrorStatement
                text={"Username can contain alphabets, numbers and underscore."}
              />
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-10 px-2 flex flex-col gap-y-5">
          <p className="font-medium">Bio</p>
          <textarea
            className="bg-transparent w-full border-2 h-36 rounded-lg p-4"
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="mt-10 flex justify-center items-center">
          <div className="w-[40%]">
            <CTAButton
              onClick={handleSubmit}
              disabled={disabled}
              disabledText={"Please Wait..."}
              text={"Submit"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
