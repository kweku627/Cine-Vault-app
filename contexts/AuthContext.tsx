import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthApiService } from '@/services/AuthApiService';
import { UserActionsService } from '@/services/UserActionsService';
import { biometricService } from '@/services/BiometricService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_REQUIRED_KEY = 'biometric_required';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  biometricAuthenticated: boolean;
  biometricRequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  enableBiometric: () => Promise<{ success: boolean; error?: string }>;
  disableBiometric: () => Promise<{ success: boolean; error?: string }>;
  checkBiometricStatus: () => Promise<void>;
  authenticateWithBiometric: () => Promise<{ success: boolean; error?: string }>;
  skipBiometricAuth: () => void;
  setBiometricRequired: (required: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);
  const [biometricRequired, setBiometricRequiredState] = useState(false);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await AuthApiService.getToken();
      const authenticated = !!token;
      
      console.log('AuthContext - Token found:', !!token);
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Optionally fetch user data here
        // const userData = await AuthApiService.getCurrentUser();
        // setUser(userData);
        const storedUserId = await AuthApiService.getUserId(); // Implement this if not present
        if (storedUserId) {
          setUserId(storedUserId);
          try {
            const userData = await UserActionsService.fetchUserById(storedUserId);
            setUser(userData);
          } catch (e) {
            setUser(null);
          }
        }
      }
      
      // Check biometric status
      await checkBiometricStatus();
      
      // Check if biometric is required
      const required = await AsyncStorage.getItem(BIOMETRIC_REQUIRED_KEY);
      console.log('AuthContext - Biometric required setting:', required);
      setBiometricRequiredState(required === 'true');
    } catch (error) {
      console.error('AuthContext - Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await AuthApiService.login({ email, password });
      setIsAuthenticated(true);
      
      // Reset biometric authentication state on login
      setBiometricAuthenticated(false);
      console.log('AuthContext - Login successful, reset biometricAuthenticated to false');
      
      // setUser(response.user);
      const id = response.user?.id || response.id; // Adjust based on your login response
      setUserId(id);
      if (id) {
        const userData = await UserActionsService.fetchUserById(id);
        setUser(userData);
      } else {
        setUser(null);
      }
      
      // Re-check biometric status after login
      await checkBiometricStatus();
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthApiService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setUserId(null);
      setBiometricAuthenticated(false);
    } catch (error) {
      console.error('AuthContext - Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await AuthApiService.register(userData);
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      console.error('AuthContext - Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkBiometricStatus = async () => {
    try {
      console.log('AuthContext - Checking biometric status...');
      const [sensorAvailable, biometricEnabled] = await Promise.all([
        biometricService.isSensorAvailable(),
        biometricService.isBiometricEnabled(),
      ]);
      
      console.log('AuthContext - Biometric status results:', {
        sensorAvailable: sensorAvailable.available,
        biometricEnabled
      });
      
      setBiometricAvailable(sensorAvailable.available);
      setBiometricEnabled(biometricEnabled);
    } catch (error) {
      console.error('AuthContext - Biometric status check error:', error);
      setBiometricAvailable(false);
      setBiometricEnabled(false);
    }
  };

  const loginWithBiometric = async () => {
    try {
      setIsLoading(true);
      
      // Authenticate with biometric
      const authResult = await biometricService.authenticateWithSignature({
        promptMessage: 'Sign in with biometrics',
        cancelButtonText: 'Use password',
      });

      if (!authResult.success) {
        throw new Error(authResult.error || 'Biometric authentication failed');
      }

      // Get stored user ID
      const biometricUserId = await biometricService.getBiometricUserId();
      if (!biometricUserId) {
        throw new Error('No biometric user ID found');
      }

      // Here you would typically send the signature to your backend for validation
      // For now, we'll just authenticate the user directly
      setUserId(biometricUserId);
      setIsAuthenticated(true);
      
      try {
        const userData = await UserActionsService.fetchUserById(biometricUserId);
        setUser(userData);
      } catch (e) {
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext - Biometric login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithBiometric = async (): Promise<{ success: boolean; error?: string }> => {
    console.log('AuthContext - authenticateWithBiometric called');
    console.log('AuthContext - biometric states:', { biometricEnabled, biometricAvailable, biometricRequired });
    
    try {
      if (!biometricEnabled) {
        console.log('AuthContext - Biometric not enabled, skipping...');
        return { success: true }; // Skip if not enabled
      }

      console.log('AuthContext - Calling biometricService.simplePrompt...');
      const authResult = await biometricService.simplePrompt({
        promptMessage: 'Authenticate to access the app',
        cancelButtonText: 'Cancel',
      });

      console.log('AuthContext - Biometric auth result:', authResult);

      if (authResult.success) {
        console.log('AuthContext - Setting biometricAuthenticated to true');
        setBiometricAuthenticated(true);
        return { success: true };
      } else {
        console.log('AuthContext - Biometric auth failed:', authResult.error);
        return { success: false, error: authResult.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('AuthContext - Biometric authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const skipBiometricAuth = () => {
    setBiometricAuthenticated(true);
  };

  const setBiometricRequired = async (required: boolean) => {
    try {
      await AsyncStorage.setItem(BIOMETRIC_REQUIRED_KEY, required.toString());
      setBiometricRequiredState(required);
    } catch (error) {
      console.error('Failed to save biometric required setting:', error);
    }
  };

  const enableBiometric = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!userId) {
        return { success: false, error: 'User not authenticated' };
      }

      const result = await biometricService.enableBiometric(userId);
      if (result.success) {
        setBiometricEnabled(true);
      }
      return result;
    } catch (error) {
      console.error('AuthContext - Enable biometric error:', error);
      return { success: false, error: 'Failed to enable biometric authentication' };
    }
  };

  const disableBiometric = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await biometricService.disableBiometric();
      if (result.success) {
        setBiometricEnabled(false);
        setBiometricAuthenticated(false);
      }
      return result;
    } catch (error) {
      console.error('AuthContext - Disable biometric error:', error);
      return { success: false, error: 'Failed to disable biometric authentication' };
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      biometricEnabled,
      biometricAvailable,
      biometricAuthenticated,
      biometricRequired,
      login,
      loginWithBiometric,
      logout,
      register,
      checkAuthStatus,
      enableBiometric,
      disableBiometric,
      checkBiometricStatus,
      authenticateWithBiometric,
      skipBiometricAuth,
      setBiometricRequired,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 