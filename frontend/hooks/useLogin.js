import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    console.log("Starting login...");
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      "https://glaucoma-mate-backend.onrender.com/api/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    console.log("Response:", response);
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      // If the response from the server is successful (status code 200-299)
    
      // Use Firebase Authentication to sign in the user with the provided email and password
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // If signing in is successful, the 'userCredential' object contains information about the user
          console.log(userCredential);
        })
        .catch((error) => {
          // If there's an error during the sign-in process, log the error
          console.log(error);
        });
    
      // Store user information in local storage
      // localStorage.setItem("user", JSON.stringify(json));
    
      // Log a success message with the user data received from the server
      console.log("Login successful:", json);
    
      // Dispatch an action to update the authentication state (assuming it's managed by a context or state)
      dispatch({ type: "LOGIN", payload: json });
    
      // Set the loading state to false, indicating that the login process is complete
      setIsLoading(false);
    }
  }    

  return { login, isLoading, error };
};
