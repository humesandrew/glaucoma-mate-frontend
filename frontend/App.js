// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './routes/HomeStack.js';
import { AuthContextProvider } from './context/AuthContext.js';

export default function App() {
  return (
    <AuthContextProvider>
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
    </AuthContextProvider>
  );
}
