import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import Auth from "../screens/Auth.js";
import Doses from "../screens/Doses.js";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  // Access the user context
  const { user, dispatch } = useAuthContext();
  const navigation = useNavigation();

  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!user && firebaseUser) {
        // Update AuthContext with the Firebase user if it's empty
        dispatch({ type: "LOGIN", payload: firebaseUser });
        setIsLoggedIn(true);
        console.log('HomeStack login')
      } else if (!firebaseUser) {
        setIsLoggedIn(false);
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [dispatch, user]);

  useEffect(() => {
    // Use this effect to navigate when the user logs in or out
    if (isLoggedIn) {
      // Navigate to 'Doses' when the user is logged in
      navigation.navigate("Doses");
    } else {
      // Navigate to 'Signin' when the user logs out
      navigation.navigate("Signin");
    }
  }, [isLoggedIn, navigation]);

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? "Doses" : "Signin"}>
      <Stack.Screen name="Signin" component={Auth} />
      <Stack.Screen name="Doses" component={Doses} />
    </Stack.Navigator>
  );
};

export default HomeStack;
