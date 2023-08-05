// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './routes/HomeStack.js';

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
