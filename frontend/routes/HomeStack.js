import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useNavigation } from "@react-navigation/native";
import Auth from "../screens/Auth.js";
import Doses from "../screens/Doses.js";
import Manage from "../screens/Manage.js";
import Signup from "../screens/Signup.js";
import { auth } from "../firebase";
import { getIdToken } from "firebase/auth";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const { user, dispatch } = useAuthContext();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await getIdToken(firebaseUser);
          console.log("HomeStack token:", token);
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

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(
              "Failed to synchronize with backend: " + errData.error
            );
          }

          const userData = await response.json();
          console.log("Fetched userData:", userData);
          dispatch({
            type: "LOGIN",
            payload: { ...userData, authToken: token },
          });
          navigation.navigate("Doses", { authToken: token }); // Navigate to Doses on successful login
        } catch (error) {
          // console.error('Synchronization error:', error);
        }
      } else {
        dispatch({ type: "LOGOUT" });
        navigation.navigate("Login"); // Navigate to Login on logout
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigation]); // Include navigation in the dependency array

  return (
    <Stack.Navigator>
      {!user ? ( // Only show the login and signup screens if the user is not logged in
        <>
          <Stack.Screen name="Login" component={Auth} />
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
