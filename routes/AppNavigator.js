import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Doses from '../screens/Doses.js';
import Manage from '../screens/Manage.js';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Doses" component={Doses} options={{ title: 'Track your doses' }}/>
      <Stack.Screen name="Manage" component={Manage} options={{ title: 'Manage medications' }}/>
    </Stack.Navigator>
  );
}
