import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const { logout } = useAuth();

  const clearAuthState = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      await logout();
      Alert.alert('Success', 'Authentication state cleared');
    } catch (error) {
      console.error('Error clearing auth state:', error);
      Alert.alert('Error', 'Failed to clear authentication state');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      {/* Branding */}
      <View style={styles.brandingContainer}>
        <Ionicons name="film-outline" size={64} color={theme.colors.primary} style={styles.logoIcon} />
        <Text style={[styles.appName, { color: theme.colors.primary }]}>Cine Vault</Text>
      </View>

      {/* Entry Options */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.button }]}
          activeOpacity={0.8}
          onPress={() => router.replace('/auth?mode=login')}
        >
          <Text style={[styles.buttonText, { color: theme.colors.surface }]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.button }]}
          activeOpacity={0.8}
          onPress={() => router.replace('/auth?mode=register')}
        >
          <Text style={[styles.buttonText, { color: theme.colors.surface }]}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Debug Options */}
      <View style={styles.debugSection}>
        <TouchableOpacity
          style={[styles.debugButton, { borderColor: theme.colors.textMuted }]}
          onPress={clearAuthState}
        >
          <Text style={[styles.debugButtonText, { color: theme.colors.textMuted }]}>
            Clear Auth State (Debug)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Optional Enhancements */}
      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: theme.colors.textMuted }]}>v1.0.0</Text>
        {/* <LanguageSelector /> */}
        {/* <LottieView source={require('@/assets/animation.json')} autoPlay loop /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: Platform.OS === 'ios' ? 48 : 24,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  buttonGroup: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  debugSection: {
    width: '100%',
    marginBottom: 20,
  },
  debugButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  debugButtonText: {
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 