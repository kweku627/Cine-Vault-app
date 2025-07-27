import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import LoginScreen from './login';
import SignupStep1 from './signup-1';
import WelcomeScreen from './WelcomeScreen';

export default function AuthScreen() {
  const { mode } = useLocalSearchParams();

  // If no mode is specified, show the welcome screen
  if (!mode) {
    return <WelcomeScreen />;
  }

  // Route to appropriate screen based on mode
  switch (mode) {
    case 'login':
      return <LoginScreen />;
    case 'register':
      return <SignupStep1 />;
    default:
      return <WelcomeScreen />;
  }
} 