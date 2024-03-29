import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import Auth from "../screens/Auth.js";
import Doses from "../screens/Doses.js";
import Manage from "../screens/Manage.js";


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
      } else if (!firebaseUser && isLoggedIn) {
        // Reset isLoggedIn when the user logs out
        setIsLoggedIn(false);
        // Navigate to the 'Signin' screen when the user logs out
        navigation.navigate("Signin");
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [dispatch, user, isLoggedIn, navigation]);

  return (
    <Stack.Navigator>
     
      <Stack.Screen name="Signin" component={Auth} />
      <Stack.Screen name="Doses" component={Doses} />
      <Stack.Screen name="Manage" component={Manage} />
    </Stack.Navigator>
  );
};

export default HomeStack;
