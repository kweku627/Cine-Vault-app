import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  console.log('Index render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  if (isLoading) {
    console.log('Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    console.log('Redirecting to main app');
    return <Redirect href="/(tabs)" />;
  } else {
    console.log('Redirecting to auth welcome screen');
    return <Redirect href="/auth" />;
  }
} 