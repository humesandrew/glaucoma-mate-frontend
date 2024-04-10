import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Obtain the Firebase authentication token
      const authToken = await firebaseUser.getIdToken();

      // Here, instead of console.logging, directly proceed with backend call
      const backendResponse = await fetch('https://glaucoma-mate-backend.onrender.com/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          firebaseUid: firebaseUser.uid,
        }),
      });

      if (!backendResponse.ok) {
        const errorResponse = await backendResponse.json();
        throw new Error(errorResponse.error || 'Failed to create user record in MongoDB.');
      }

      // Assuming backend signup also responds with necessary user data
      const mongoUserData = await backendResponse.json();
      
      // Prepare userData for the context, including the authToken
      const userData = {
        ...mongoUserData,
        authToken, // Include authToken directly in userData
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        },
      };

      // Dispatch LOGIN action with userData, including authToken
      dispatch({ type: 'LOGIN', payload: userData });
      setIsLoading(false);

      // Optionally, if you need to navigate to Doses page or elsewhere after signup,
      // pass the authToken as a parameter or ensure it's accessible in the global context.
      // This part depends on your app's routing and state management setup.
    } catch (error) {
      console.error('Error during signup:', error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { signup, isLoading, error };
};
