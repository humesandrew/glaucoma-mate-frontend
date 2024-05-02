import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const useSignup = (navigateToDoses) => {  // Accept navigation callback as parameter
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

      const mongoUserData = await backendResponse.json();

      const userData = {
        ...mongoUserData,
        authToken,
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        },
      };

      dispatch({ type: 'LOGIN', payload: userData });
      setIsLoading(false);
      navigateToDoses(); // Navigate after successful signup and login
    } catch (error) {
      console.error('Error during signup:', error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { signup, isLoading, error };
};
