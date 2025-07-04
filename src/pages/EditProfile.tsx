import { useDBUser } from "../context/userContext";
import { CTAButton, ErrorStatement, Input } from "../components";
import { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { isValidUsername } from "../functions/regexFunctions";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const EditProfile = () => {
  // Db user object
  const { dbUser, fetchUser } = useDBUser();
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
    document.title = `Edit Profile | The Thought Journal`;
  }, []);

  // To set default values.
  useEffect(() => {
    if (dbUser) {
      setName(dbUser?.name);
      setImage(dbUser?.photoURL);
      setBio(dbUser?.bio);
      setUsername(dbUser?.username);
    }
  }, [dbUser]);

  // Set the received image in the state.
  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
    fileRef.current.value = null;
  };

  // Submit the data to the server to edit the user object.
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

    if (username != dbUser?.username) {
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
              bio: bio,
              username: username,
              name: name,
              image: typeof image == "string" ? image : null,
            };

            // Append the new user object in formdata
            formData.append("updatedUser", JSON.stringify(obj));
            formData.append("userId", dbUser?.id);

            // Add user in DB
            axiosInstance
              .post("/auth/update-user", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              .then(() => {
                setDisabled(false);
                fetchUser();
                toast.success("Profile Updated!");
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
    } else {
      // Create formdata instance
      const formData = new FormData();

      // If image is added - add a file
      if (typeof image != "string") {
        formData.append("file", image);
      }

      // Add details in the user object
      const obj = {
        bio: bio,
        username: username,
        name: name,
        image: typeof image == "string" ? image : null,
      };

      // Append the new user object in formdata
      formData.append("updatedUser", JSON.stringify(obj));
      formData.append("userId", dbUser?.id);

      // Add user in DB
      axiosInstance
        .post("/auth/update-user", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          setDisabled(false);
          fetchUser();
          toast.success("Profile Updated!");
        })
        .catch(() => {
          // Display error
          toast.error("Something went wrong!");
          // Enable button
          setDisabled(false);
        });
    }
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, dbUser?.email); // Replace with your Firebase auth instance & user’s email
      toast("Password reset email sent!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
      // Maybe show error message too
    }
  };

  return (
    <>
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
        <div className="bg-white dark:bg-darkgrey dark:border-white/25 border-[1px] px- w-[90%] md:w-[65%] md:mt-5 lg:mt-5 p-5 md:px-20 shadow-xl rounded-2xl pb-10">
          {/* Title */}
          <h1 className="text-ink dark:text-darkmodetext pt-5 font-bold text-2xl text-center">
            Edit your Journal Account!
          </h1>

          {/* Image Upload */}
          <div className="mt-10 flex flex-col gap-y-5">
            {/* Input to accept image */}
            <input
              className="hidden"
              type="file"
              ref={fileRef}
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleFileChange}
            />
            {/* Display user image or default account image */}
            <div className="flex justify-center">
              {image ? (
                <img
                  src={
                    typeof image == "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  className="h-24 w-24 rounded-full"
                />
              ) : (
                <img
                  src={
                    "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736740649/account_glotqh.png"
                  }
                  className="h-24 w-24 rounded-full"
                />
              )}
            </div>

            {/* Button to select an image */}
            <button
              onClick={() => fileRef.current.click()}
              className="cursor-pointer w-fit mx-auto my-3 hover:bg-hovercta dark:hover:bg-cta hover:border-hovercta hover:text-white dark:hover:border-cta border-darkbg/25 dark:border-white/25 border-[1px] flex gap-x-2 py-2 justify-center items-center px-14 shadow rounded-lg font-medium active:shadow transition-all disabled:text-greyText"
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
                <ErrorStatement
                  text={"Username cannot exceed 20 characters."}
                />
              )}
              {error.username == 4 && (
                <ErrorStatement
                  text={
                    "Username can contain alphabets, numbers and underscore."
                  }
                />
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-10 px-2 flex flex-col gap-y-5">
            <p className="font-medium">Bio</p>
            <textarea
              value={bio}
              className="bg-transparent w-full border-2 dark:border-white/25 h-36 rounded-lg p-4 focus:outline-none"
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          {/* Password Reset Button */}
          <div className="mt-8 flex justify-center items-center">
            <button
              onClick={handlePasswordReset} // 👉 your handler to send the email
              className="cursor-pointer hover:bg-hovercta dark:hover:bg-cta hover:border-hovercta hover:text-white dark:hover:border-cta border-darkbg/25 dark:border-white/25 border-1 flex gap-x-2 py-2 justify-center items-center px-8 shadow rounded-lg font-medium active:shadow transition-all"
            >
              Send Password Reset Email
            </button>
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
    </>
  );
};

export default EditProfile;
