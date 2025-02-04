import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../hooks/useAuthContext.js";
import Auth from "../screens/Auth.js";
import Doses from "../screens/Doses.js";
import Manage from "../screens/Manage.js";
import Signup from "../screens/Signup.js";
import { auth } from "../firebase";
import { getIdToken } from "firebase/auth";

const Stack = createNativeStackNavigator();

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
          console.error("HomeStack: Error during token synchronization:", error.message);
          dispatch({ type: "LOGOUT" });
        }
      } else {
        console.log("HomeStack: No Firebase user found, dispatching LOGOUT");
        dispatch({ type: "LOGOUT" });
      }

      setIsCheckingAuth(false); 
    });

    return () => {
      console.log("HomeStack: Cleaning up auth state listener");
      unsubscribe();
    };
  }, [dispatch]);

  if (isCheckingAuth) {
    console.log("HomeStack: Checking authentication, returning loading state");
    return null; // You can replace this with a loading spinner
  }

  console.log("HomeStack: Rendering Stack.Navigator. Current user:", user);

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen
            name="Login"
            component={Auth}
            options={{ headerShown: true, title: "Login" }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: true, title: "Signup" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Doses"
            component={Doses}
            options={{ headerShown: true, title: "Track your doses" }}
          />
          <Stack.Screen
            name="Manage"
            component={Manage}
            options={{ headerShown: true, title: "Manage medications" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default HomeStack;
