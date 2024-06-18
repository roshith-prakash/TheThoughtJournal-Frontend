import { useEffect, useState } from "react";
import {
  ErrorStatement,
  Footer,
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
import { isValidEmail, isValidPassword } from "../functions/regexFunctions";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "../utils/axios";
import google from "../assets/google.png";
import login from "../assets/login.svg";

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

  // Scroll to top of page
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

        // Check if user exists in DB - if yes, send to home - if no, send to onboarding.
        axiosInstance
          .post("/auth/get-current-user", { user: user })
          .then((res) => {
            if (res?.data?.user) {
              setDisabled(false);
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            setDisabled(false);
            if (err?.response?.data?.data == "User does not exist.") {
              navigate("/onboarding");
            }
          });
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
    setDisabled(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Check if user exists in DB - if yes, send to home - if no, send to onboarding.
        axiosInstance
          .post("/auth/get-current-user", { user: user })
          .then((res) => {
            if (res?.data?.user) {
              setDisabled(false);
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            setDisabled(false);
            if (err?.response?.data?.data == "User does not exist.") {
              navigate("/onboarding");
            }
          });
      })
      .catch((error) => {
        // Handle Errors here.
        setDisabled(false);
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
      <div className="lg:min-h-[89vh] flex w-full bg-none lg:bg-bgwhite">
        {/* Image Div - displayed only on laptop */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center">
          <img src={login} className="max-w-[70%]" />
        </div>

        {/* Right Div */}
        <div className="min-h-[95vh] mt-5 lg:mt-0 lg:h-full lg:min-h-[88vh] pb-10 flex-1 flex justify-center items-center">
          {/* Login Form Div */}
          <div className="bg-white border-[1px] w-[85%] -translate-y-5 md:-translate-y-0 px-8 md:w-[65%] mt-5 md:mt-14 lg:mt-5 p-5 md:px-20 shadow-xl rounded-xl pb-10">
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
      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
};

export default Login;
