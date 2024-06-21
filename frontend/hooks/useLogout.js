import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { auth } from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Firebase to sign out the user
      await auth.signOut();

      // Clear the auth token from AsyncStorage
      await AsyncStorage.removeItem('authToken');

      // Dispatch logout action
      dispatch({ type: "LOGOUT" });
      setIsLoading(false);
      console.log("Logout completed");

      // Check Firebase authentication status
      auth.onAuthStateChanged((user) => {
        if (!user) {
          console.log("Firebase user is signed out");
          console.log(auth);
        } else {
          console.log("Firebase user is still signed in");
        }
      });
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      console.log("Error during logout:", error);
    }
  };

  return { logout, isLoading, error };
};
