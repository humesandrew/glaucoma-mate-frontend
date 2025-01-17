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
          const token = await getIdToken(firebaseUser, true);
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
  
          if (response.ok) {
            const userData = await response.json();
            console.log("Fetched userData:", userData);
  
            dispatch({
              type: "LOGIN",
              payload: { ...userData, authToken: token },
            });
  
            // Navigate only if the user is successfully synchronized
            navigation.navigate("Doses", { authToken: token });
          } else {
            console.error("Failed to synchronize with backend:", response.statusText);
            const errData = await response.json();
            console.error("Error details:", errData.error);
          }
        } catch (error) {
          console.error("Error in token synchronization:", error.message);
        }
      } else {
        dispatch({ type: "LOGOUT" });
        navigation.navigate("Login");
      }
    });
  
    return () => unsubscribe();
  }, [dispatch, navigation]);
  
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
