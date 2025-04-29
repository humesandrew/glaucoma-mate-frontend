// HomeStack.js
import React, { useEffect, useState } from "react";
import { auth } from "../firebase.js";
import { getIdToken } from "firebase/auth";
import { useAuthContext } from "../hooks/useAuthContext.js";

// ← NEW: your two smaller navigator modules
import AuthNavigator from "./AuthNavigator.js";
import AppNavigator  from "./AppNavigator.js";

const HomeStack = () => {
  const { user, dispatch } = useAuthContext();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("HomeStack: Starting auth state check");

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log("HomeStack: Firebase auth state changed. User:", firebaseUser);

      if (firebaseUser) {
        try {
          const token = await getIdToken(firebaseUser, true);
          console.log("HomeStack: Firebase token fetched:", token);

          // Send token to backend for verification
          const response = await fetch(
            "https://glaucoma-mate-backend.onrender.com/api/user/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("HomeStack: Backend response status:", response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log("HomeStack: Fetched userData from backend:", userData);

            // Update user state in AuthContext
            dispatch({
              type: "LOGIN",
              payload: { ...userData, authToken: token },
            });
          } else {
            console.error(
              "HomeStack: Backend failed to validate token. Response:",
              await response.text()
            );
            throw new Error("Unauthorized - Token validation failed");
          }
        } catch (error) {
          console.error(
            "HomeStack: Error during token synchronization:",
            error.message
          );
          dispatch({ type: "LOGOUT" });
        }
      } else {
        console.log(
          "HomeStack: No Firebase user found, dispatching LOGOUT"
        );
        dispatch({ type: "LOGOUT" });
      }

      setIsCheckingAuth(false);
    });

    return () => {
      console.log("HomeStack: Cleaning up auth state listener");
      unsubscribe();
    };
  }, [dispatch]);

  // still block render until we've finished the above
  if (isCheckingAuth) {
    console.log(
      "HomeStack: Checking authentication, returning loading state"
    );
    return null; // you can show a spinner here
  }

  console.log("HomeStack: Rendering appropriate Navigator. Current user:", user);

  // ← NEW: pick one of your navigators
  return user
  ? <AppNavigator key="app" />
  : <AuthNavigator key="auth" />;
};

export default HomeStack;
