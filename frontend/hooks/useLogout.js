import { useAuthContext } from "./useAuthContext";
import { signOut } from "firebase/auth"; // Import the Firebase signOut function

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    try {
      // Use Firebase Authentication to sign out the user
      await signOut(auth);

      // Dispatch logout action
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { logout };
};
