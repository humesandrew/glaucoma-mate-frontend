import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Alert } from 'react-native';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, navigateToDoses) => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Obtain the Firebase authentication token
      const tempToken = await firebaseUser.getIdToken();

      const backendResponse = await fetch('https://glaucoma-mate-backend.onrender.com/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`,
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
        authToken: tempToken, // Now set the token as authToken after successful MongoDB user creation
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        },
      };

      dispatch({ type: 'LOGIN', payload: userData });
      Alert.alert("Success", "Signup successful! Redirecting to your doses...");
      setIsLoading(false);
      navigateToDoses({ authToken: tempToken }); // Navigate after successful signup and login
    } catch (error) {
      console.error('Error during signup:', error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { signup, isLoading, error };
};
