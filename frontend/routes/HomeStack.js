// authStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '../screens/Auth.js';
import Doses from '../screens/Doses.js';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen name="Signin" component={Auth} />
      <Stack.Screen name="Doses" component={Doses} />
    </Stack.Navigator>
  );
};

export default AuthStack;
