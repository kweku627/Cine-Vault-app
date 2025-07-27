import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function BiometricAuthScreen() {
  const { theme } = useTheme();
  const { 
    biometricEnabled, 
    biometricAvailable, 
    biometricRequired,
    biometricAuthenticated,
    authenticateWithBiometric, 
    logout 
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('BiometricAuthScreen - Mounted with states:', {
    biometricEnabled,
    biometricAvailable,
    biometricRequired,
    biometricAuthenticated,
    isLoading
  });

  useEffect(() => {
    // Auto-trigger biometric authentication if enabled and required
    const autoTriggerAuth = async () => {
      console.log('useEffect triggered with states:', { biometricRequired, biometricEnabled, biometricAvailable, isLoading });
      
      if (biometricRequired && biometricEnabled && biometricAvailable && !isLoading) {
        console.log('Auto-triggering biometric authentication...');
        await handleBiometricAuth();
      } else {
        console.log('Not auto-triggering because:', {
          biometricRequired,
          biometricEnabled,
          biometricAvailable,
          isLoading
        });
      }
    };
    
    // Add a small delay to ensure the screen is fully loaded
    const timer = setTimeout(autoTriggerAuth, 1000);
    
    return () => clearTimeout(timer);
  }, [biometricRequired, biometricEnabled, biometricAvailable, isLoading]);

  const handleBiometricAuth = async () => {
    console.log('handleBiometricAuth called');
    console.log('Current states:', { biometricRequired, biometricEnabled, biometricAvailable, isLoading });
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Calling authenticateWithBiometric...');
      const result = await authenticateWithBiometric();
      console.log('Biometric auth result:', result);
      
      if (result.success) {
        console.log('Biometric auth successful, navigating to main app...');
        // Navigate to main app
        router.replace('/(tabs)');
      } else {
        console.log('Biometric auth failed:', result.error);
        setError(result.error || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Biometric auth error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };



  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          }
        },
      ]
    );
  };

  const getBiometricIcon = () => {
    if (!biometricAvailable) return 'finger-print-outline';
    if (biometricEnabled) return 'finger-print';
    return 'finger-print-outline';
  };

  const getBiometricText = () => {
    if (!biometricAvailable) return 'Biometric authentication not available';
    if (biometricEnabled) return 'Authenticate with biometrics';
    return 'Biometric authentication not enabled';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Authentication Required</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.appIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="film" size={48} color={theme.colors.surface} />
          </View>
        </View>

        {/* Welcome Text */}
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
          Welcome to Cine Vault
        </Text>
        <Text style={[styles.subtitleText, { color: theme.colors.textSecondary }]}>
          Please authenticate to continue
        </Text>

        {/* Biometric Status */}
        <View style={[styles.statusCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.statusRow}>
            <Ionicons 
              name={getBiometricIcon()} 
              size={24} 
              color={biometricEnabled ? theme.colors.primary : theme.colors.textMuted} 
            />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              {getBiometricText()}
            </Text>
          </View>
          

        </View>

        {/* Error Message */}
        {error && (
          <View style={[styles.errorCard, { backgroundColor: theme.colors.error + '20' }]}>
            <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {biometricRequired && biometricEnabled && biometricAvailable && (
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: theme.colors.primary },
                isLoading && styles.disabledButton
              ]}
              onPress={handleBiometricAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.surface} size="small" />
              ) : (
                <Ionicons name="finger-print" size={24} color={theme.colors.surface} />
              )}
              <Text style={[styles.primaryButtonText, { color: theme.colors.surface }]}>
                {isLoading ? 'Authenticating...' : 'Use Biometric'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Test button for Expo development */}
          <TouchableOpacity
            style={[
              styles.testButton,
              { backgroundColor: theme.colors.secondary }
            ]}
            onPress={handleBiometricAuth}
            disabled={isLoading}
          >
            <Ionicons name="finger-print" size={20} color={theme.colors.surface} />
            <Text style={[styles.testButtonText, { color: theme.colors.surface }]}>
              Proceed with Biometric
            </Text>
          </TouchableOpacity>


        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            You can enable biometric authentication in the app settings
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  logoutButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 