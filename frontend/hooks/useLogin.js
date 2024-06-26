import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if the user is already authenticated with Firebase
      const user = auth.currentUser;

      if (user) {
        // User is already logged in via Firebase
        const authToken = await AsyncStorage.getItem('authToken');
        if (authToken) {
          const response = await fetch('https://glaucoma-mate-backend.onrender.com/api/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error("Failed to synchronize with backend: " + errData.error);
          }

          const json = await response.json();

          const userData = {
            ...json,
            firebaseUser: {
              uid: user.uid,
              email: user.email,
            },
          };

          // Dispatch login action
          dispatch({ type: 'LOGIN', payload: userData });
          setIsLoading(false);
          return;
        }
      }

      // User is not logged in via Firebase, proceed with authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Obtain the Firebase authentication token
      const authToken = await userCredential.user.getIdToken();
      console.log(authToken);

      // Save the authToken to AsyncStorage
      await AsyncStorage.setItem('authToken', authToken);

      // Send the authentication token to your backend for validation
      const response = await fetch('https://glaucoma-mate-backend.onrender.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include the token in the request headers
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setIsLoading(false);
        setError('Custom authentication failed');
        return;
      }

      const json = await response.json();

      // Combine Firebase user information and custom backend data
      const userData = {
        ...json,
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // Add other necessary user data from Firebase
        },
      };

      // Dispatch login action
      dispatch({ type: 'LOGIN', payload: userData });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      console.log('Error during login:', error);
    }
  };

  return { login, isLoading, error };
};
