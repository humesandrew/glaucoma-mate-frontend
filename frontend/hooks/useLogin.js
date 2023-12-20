// useLogin.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Firebase to authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user information from your backend
      const response = await fetch('https://glaucoma-mate-backend.onrender.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          uid: user.uid,
          email: user.email,
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
