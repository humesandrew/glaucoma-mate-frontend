import { useState } from 'react';
import { useAuthContext } from './useAuthContext'; 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

export const useLogin = () => {
   
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false); 
   const { dispatch } = useAuthContext();

   const login = async (email, password) => { 
    console.log('Starting login...');
      setIsLoading(true);
      setError(null);

      const response = await fetch('https://glaucoma-mate-backend.onrender.com/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ email, password }),
      });
      console.log('Response:', response);
      const json = await response.json();

      if (!response.ok) {
          setIsLoading(false);
          setError(json.error);
      }

      if (response.ok) {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
console.log(userCredential);
 console.log('hello');
        }).catch((error) => {console.log(error)});
          localStorage.setItem('user', JSON.stringify(json));
          console.log('Login successful:', json);
          dispatch({ type: 'LOGIN', payload: json });
          setIsLoading(false);
      }
   };

   return { login, isLoading, error };
};
