import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { biometricService } from '@/services/BiometricService';

interface BiometricLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onFallback?: () => void;
  style?: any;
  disabled?: boolean;
}

export default function BiometricLoginButton({
  onSuccess,
  onError,
  onFallback,
  style,
  disabled = false,
}: BiometricLoginButtonProps) {
  const { theme } = useTheme();
  const { biometricAvailable, biometricEnabled, loginWithBiometric } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleBiometricLogin = async () => {
    if (!biometricAvailable || !biometricEnabled || disabled) {
      if (onFallback) {
        onFallback();
      } else {
        Alert.alert(
          'Biometric Not Available',
          'Please use your email and password to sign in.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    setIsLoading(true);
    try {
      await loginWithBiometric();
      onSuccess?.();
    } catch (error: any) {
      console.error('Biometric login failed:', error);
      const errorMessage = error?.message || 'Biometric authentication failed';
      onError?.(errorMessage);
      
      // Show user-friendly error message
      Alert.alert(
        'Authentication Failed',
        errorMessage,
        [
          { text: 'Try Again', onPress: () => {} },
          { text: 'Use Password', onPress: onFallback || (() => {}) }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricIcon = () => {
    if (!biometricAvailable) return 'finger-print-outline';
    return 'finger-print';
  };

  const getButtonText = () => {
    if (!biometricAvailable) return 'Biometric Not Available';
    if (!biometricEnabled) return 'Enable Biometric Login';
    if (isLoading) return 'Authenticating...';
    return 'Sign in with Biometrics';
  };

  const isButtonDisabled = disabled || isLoading || !biometricAvailable;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isButtonDisabled 
            ? theme.colors.disabled 
            : biometricEnabled 
              ? theme.colors.primary 
              : theme.colors.secondary,
          opacity: isButtonDisabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={handleBiometricLogin}
      disabled={isButtonDisabled}
      activeOpacity={0.8}
    >
      <Ionicons
        name={getBiometricIcon()}
        size={24}
        color={theme.colors.surface}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: theme.colors.surface }]}>
        {getButtonText()}
      </Text>
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <Ionicons name="ellipsis-horizontal" size={16} color={theme.colors.surface} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginLeft: 8,
  },
}); 