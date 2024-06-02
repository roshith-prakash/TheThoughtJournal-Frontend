import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useAuth } from "../context/authContext";
import { checkVerified } from "../functions/checkVerified";

const provider = new GoogleAuthProvider();

const Home = () => {
  const [file, setFile] = useState();
  const { currentUser } = useAuth();

  console.log("CurrentUser", currentUser);
  console.log("Is user verified", checkVerified());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSignIn = () => {
    createUserWithEmailAndPassword(auth, "rajijik574@adrais.com", "abcdefg")
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        sendEmailVerification(user).then((res) => {
          console.log(res);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });

    // signInWithEmailAndPassword(auth, "roshithprakash7@gmail.com", "abcedfg")
    //   .then((userCredential) => {
    //     // Signed in
    //     const user = userCredential.user;
    //     console.log(user);

    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.log(errorMessage);
    //   });

    // signInWithPopup(auth, provider)
    //   .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     console.log(user);
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    //   })
    //   .catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //   });
  };

  // const handleClick = () => {
  //   const formdata = new FormData();
  //   formdata.append("file", file);
  //   axios
  //     .post("http://localhost:4000/upload", formdata, {
  //       headers: {
  //         "Content-Type": "multipart/formdata",
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed Out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Navbar />
      <div>Home</div>
      {/* 
      <input
        type="file"
        accept="image/.jpg,.jpeg,.png"
        onChange={handleFileChange}
      /> */}
      <br />
      <br />

      <button onClick={handleSignIn}>Sign In</button>
      <br />
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  );
};

export default Home;
