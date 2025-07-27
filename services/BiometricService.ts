import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BIOMETRIC_KEYS = {
  IS_ENABLED: 'biometric_enabled',
  USER_ID: 'biometric_user_id',
};

export interface BiometricConfig {
  allowDeviceCredentials?: boolean;
  promptMessage?: string;
  cancelButtonText?: string;
}

export class BiometricService {
  private config: BiometricConfig;

  constructor(config: BiometricConfig = {}) {
    this.config = {
      allowDeviceCredentials: config.allowDeviceCredentials ?? true,
      ...config,
    };
  }

  /**
   * Check if biometric sensor is available on the device
   */
  async isSensorAvailable(): Promise<{
    available: boolean;
    biometryType: string | null;
    error?: string;
  }> {
    try {
      // For Expo Go testing, we'll simulate biometric availability
      if (__DEV__ && Platform.OS === 'web') {
        console.log('BiometricService - Running in Expo Go web, simulating biometric availability');
        return { available: true, biometryType: 'Simulated Biometrics' };
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware) {
        return { available: false, biometryType: null, error: 'No biometric hardware available' };
      }
      
      if (!isEnrolled) {
        return { available: false, biometryType: null, error: 'No biometric credentials enrolled' };
      }

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      let biometryType = 'Biometrics';
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometryType = 'Fingerprint';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometryType = 'Face Recognition';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        biometryType = 'Iris';
      }

      return { available: true, biometryType };
    } catch (error) {
      console.error('Biometric sensor check failed:', error);
      return { available: false, biometryType: null, error: 'Sensor check failed' };
    }
  }

  /**
   * Check if biometric authentication is enabled for the app
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_KEYS.IS_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Failed to check biometric status:', error);
      return false;
    }
  }

  /**
   * Enable biometric authentication for a user
   */
  async enableBiometric(userId: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Check if sensor is available
      const sensorCheck = await this.isSensorAvailable();
      if (!sensorCheck.available) {
        return { success: false, error: sensorCheck.error || 'Biometric sensor not available' };
      }

      // For Expo Go testing, skip the actual authentication test
      if (__DEV__ && Platform.OS === 'web') {
        console.log('BiometricService - Expo Go web: Skipping authentication test');
      } else {
        // Test authentication to ensure it works
        const authResult = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use passcode',
        });

        if (!authResult.success) {
          return { success: false, error: 'Authentication test failed' };
        }
      }

      // Store biometric settings
      await AsyncStorage.multiSet([
        [BIOMETRIC_KEYS.IS_ENABLED, 'true'],
        [BIOMETRIC_KEYS.USER_ID, userId.toString()],
      ]);

      return { success: true };
    } catch (error) {
      console.error('Failed to enable biometric:', error);
      return { success: false, error: 'Failed to enable biometric authentication' };
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<{ success: boolean; error?: string }> {
    try {
      // Clear stored settings
      await AsyncStorage.multiRemove([
        BIOMETRIC_KEYS.IS_ENABLED,
        BIOMETRIC_KEYS.USER_ID,
      ]);

      return { success: true };
    } catch (error) {
      console.error('Failed to disable biometric:', error);
      return { success: false, error: 'Failed to disable biometric authentication' };
    }
  }

  /**
   * Get stored user ID for biometric authentication
   */
  async getBiometricUserId(): Promise<number | null> {
    try {
      const userId = await AsyncStorage.getItem(BIOMETRIC_KEYS.USER_ID);
      return userId ? parseInt(userId, 10) : null;
    } catch (error) {
      console.error('Failed to get biometric user ID:', error);
      return null;
    }
  }

  /**
   * Simple biometric prompt (no signature)
   */
  async simplePrompt(config: {
    promptMessage?: string;
    cancelButtonText?: string;
  } = {}): Promise<{ success: boolean; error?: string }> {
    console.log('BiometricService - simplePrompt called with config:', config);
    
    try {
      // For Expo Go testing, simulate biometric authentication
      if (__DEV__ && Platform.OS === 'web') {
        console.log('BiometricService - Expo Go web: Simulating biometric authentication');
        // Simulate a delay and return success
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }

      console.log('BiometricService - Calling LocalAuthentication.authenticateAsync...');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: config.promptMessage || 'Authenticate to continue',
        cancelLabel: config.cancelButtonText || 'Cancel',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      console.log('BiometricService - LocalAuthentication result:', result);
      return { success: result.success, error: result.success ? undefined : 'Authentication failed' };
    } catch (error) {
      console.error('BiometricService - Simple biometric prompt failed:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Authenticate with biometric (simplified version without cryptographic signature)
   */
  async authenticateWithSignature(config: {
    promptMessage?: string;
    cancelButtonText?: string;
    payload?: string;
  } = {}): Promise<{
    success: boolean;
    signature?: string;
    payload?: string;
    error?: string;
  }> {
    try {
      // Check if biometric is enabled
      const isEnabled = await this.isBiometricEnabled();
      if (!isEnabled) {
        return { success: false, error: 'Biometric authentication not enabled. Please enable it first.' };
      }

      // Generate payload if not provided
      const payload = config.payload || Math.round(new Date().getTime() / 1000).toString() + 'login';

      // For Expo Go testing, simulate authentication
      if (__DEV__ && Platform.OS === 'web') {
        console.log('BiometricService - Expo Go web: Simulating signature authentication');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const signature = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        return { success: true, signature, payload };
      }

      // Authenticate
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: config.promptMessage || 'Sign in with biometrics',
        cancelLabel: config.cancelButtonText || 'Cancel',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Generate a simple signature (timestamp + random string)
        const signature = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        return { success: true, signature, payload };
      } else {
        return { success: false, error: 'Authentication failed' };
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Get biometric type for display purposes
   */
  getBiometricTypeName(biometryType: string): string {
    switch (biometryType) {
      case 'Fingerprint':
        return 'Fingerprint';
      case 'Face Recognition':
        return 'Face ID';
      case 'Iris':
        return 'Iris';
      case 'Biometrics':
        return 'Biometrics';
      case 'Simulated Biometrics':
        return 'Simulated Biometrics (Expo Go)';
      default:
        return 'Biometric Authentication';
    }
  }

  /**
   * Check if device supports device credentials fallback
   */
  async supportsDeviceCredentials(): Promise<boolean> {
    try {
      const { available } = await this.isSensorAvailable();
      return available;
    } catch (error) {
      return false;
    }
  }
}

// Export a default instance
export const biometricService = new BiometricService(); 