import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '../screens/Auth.js';
import Signup from '../screens/Signup.js';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={Auth} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}
