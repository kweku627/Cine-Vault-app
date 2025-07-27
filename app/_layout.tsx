import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as ScreenCapture from 'expo-screen-capture';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WatchLaterProvider } from '@/contexts/WatchLaterContext';
import { LikesProvider } from '@/contexts/LikesContext';
import { RatingsProvider } from '@/contexts/RatingsContext';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AuthRedirector({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, biometricEnabled, biometricAuthenticated, biometricRequired } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('AuthRedirector - States:', {
      isLoading,
      isAuthenticated,
      biometricRequired,
      biometricEnabled,
      biometricAuthenticated
    });
    
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('AuthRedirector - Not authenticated, redirecting to /auth');
        router.replace('/auth');
      } else if (biometricRequired && biometricEnabled && !biometricAuthenticated) {
        // User is authenticated but needs biometric authentication
        console.log('AuthRedirector - Authenticated but needs biometric, redirecting to /biometric-auth');
        router.replace('/biometric-auth');
      } else {
        console.log('AuthRedirector - All conditions met, staying on current screen');
      }
    }
  }, [isAuthenticated, isLoading, biometricEnabled, biometricAuthenticated, biometricRequired]);

  return <>{children}</>;
}

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Hide splash screen after delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    // Prevent screen capture globally (Android only)
    if (Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }

    return () => {
      clearTimeout(timer);
      if (Platform.OS !== 'web') {
        ScreenCapture.allowScreenCaptureAsync(); // Allow capture again if component unmounts
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <AuthRedirector>
            <WatchLaterProvider>
              <LikesProvider>
                <RatingsProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="auth" />
                    <Stack.Screen name="biometric-auth" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="movie/[id]" />
                    <Stack.Screen name="series/[id]" />
                    <Stack.Screen name="watch/[id]" />
                    <Stack.Screen name="watch-series/[id]" />
                    <Stack.Screen name="profile" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="liked-content" />
                    <Stack.Screen name="rated-content" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </RatingsProvider>
              </LikesProvider>
            </WatchLaterProvider>
          </AuthRedirector>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
