import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { biometricService } from '@/services/BiometricService';

export default function BiometricDemoScreen() {
  const { theme } = useTheme();
  const { biometricAvailable, biometricEnabled, enableBiometric, disableBiometric } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sensorInfo, setSensorInfo] = useState<{
    available: boolean;
    biometryType: string | null;
    error?: string;
  }>({ available: false, biometryType: null });

  const checkSensorAvailability = async () => {
    setIsLoading(true);
    try {
      const result = await biometricService.isSensorAvailable();
      setSensorInfo({
        available: result.available,
        biometryType: result.biometryType 
          ? biometricService.getBiometricTypeName(result.biometryType)
          : null,
        error: result.error,
      });
    } catch (error) {
      setSensorInfo({
        available: false,
        biometryType: null,
        error: 'Failed to check sensor availability',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSimplePrompt = async () => {
    try {
      const result = await biometricService.simplePrompt({
        promptMessage: 'Test biometric authentication',
        cancelButtonText: 'Cancel',
      });
      
      Alert.alert(
        result.success ? 'Success' : 'Failed',
        result.success ? 'Biometric authentication successful!' : result.error || 'Authentication failed'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Simple prompt failed');
    }
  };

  const testSignatureAuth = async () => {
    try {
      const result = await biometricService.authenticateWithSignature({
        promptMessage: 'Test signature authentication',
        cancelButtonText: 'Cancel',
        payload: 'test-payload-' + Date.now(),
      });
      
      if (result.success) {
        Alert.alert(
          'Success',
          `Signature authentication successful!\nPayload: ${result.payload}\nSignature: ${result.signature?.substring(0, 20)}...`
        );
      } else {
        Alert.alert('Failed', result.error || 'Signature authentication failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signature authentication failed');
    }
  };

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    try {
      const result = await enableBiometric();
      Alert.alert(
        result.success ? 'Success' : 'Failed',
        result.success ? 'Biometric authentication enabled!' : result.error || 'Failed to enable biometric'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to enable biometric');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableBiometric = async () => {
    Alert.alert(
      'Disable Biometric',
      'Are you sure you want to disable biometric authentication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await disableBiometric();
              Alert.alert(
                result.success ? 'Success' : 'Failed',
                result.success ? 'Biometric authentication disabled!' : result.error || 'Failed to disable biometric'
              );
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to disable biometric');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const DemoButton = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    disabled = false,
    color = theme.colors.primary 
  }: {
    title: string;
    subtitle: string;
    icon: string;
    onPress: () => void;
    disabled?: boolean;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.demoButton,
        {
          backgroundColor: theme.colors.card,
          borderColor: color,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.buttonHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={[styles.buttonTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.buttonSubtitle, { color: theme.colors.textSecondary }]}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Biometric Demo</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Section */}
        <View style={[styles.statusCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.statusTitle, { color: theme.colors.text }]}>Device Status</Text>
          
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>Sensor Available:</Text>
            <View style={styles.statusValue}>
              <Ionicons 
                name={sensorInfo.available ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={sensorInfo.available ? theme.colors.success : theme.colors.error} 
              />
              <Text style={[styles.statusText, { color: theme.colors.text }]}>
                {sensorInfo.available ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>Biometric Enabled:</Text>
            <View style={styles.statusValue}>
              <Ionicons 
                name={biometricEnabled ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={biometricEnabled ? theme.colors.success : theme.colors.error} 
              />
              <Text style={[styles.statusText, { color: theme.colors.text }]}>
                {biometricEnabled ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          {sensorInfo.biometryType && (
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>Biometric Type:</Text>
              <Text style={[styles.statusText, { color: theme.colors.text }]}>
                {sensorInfo.biometryType}
              </Text>
            </View>
          )}

          {sensorInfo.error && (
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: theme.colors.error }]}>Error:</Text>
              <Text style={[styles.statusText, { color: theme.colors.error }]}>
                {sensorInfo.error}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]}
            onPress={checkSensorAvailability}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.surface} size="small" />
            ) : (
              <Ionicons name="refresh" size={20} color={theme.colors.surface} />
            )}
            <Text style={[styles.refreshButtonText, { color: theme.colors.surface }]}>
              {isLoading ? 'Checking...' : 'Check Status'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Buttons */}
        <View style={styles.demoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Test Functions</Text>
          
          <DemoButton
            title="Simple Prompt"
            subtitle="Test basic biometric authentication without signature"
            icon="finger-print"
            onPress={testSimplePrompt}
            disabled={!sensorInfo.available}
          />

          <DemoButton
            title="Signature Authentication"
            subtitle="Test biometric authentication with cryptographic signature"
            icon="key"
            onPress={testSignatureAuth}
            disabled={!sensorInfo.available || !biometricEnabled}
            color={!biometricEnabled ? theme.colors.textMuted : theme.colors.primary}
          />

          <DemoButton
            title="Enable Biometric"
            subtitle="Setup biometric authentication for this app"
            icon="shield-checkmark"
            onPress={handleEnableBiometric}
            disabled={!sensorInfo.available || biometricEnabled || isLoading}
            color={theme.colors.success}
          />

          <DemoButton
            title="Disable Biometric"
            subtitle="Remove biometric authentication from this app"
            icon="shield-outline"
            onPress={handleDisableBiometric}
            disabled={!biometricEnabled || isLoading}
            color={theme.colors.error}
          />
        </View>

        {/* Information */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>How it works</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            • Simple Prompt: Basic biometric authentication without cryptographic verification{'\n'}
            • Signature Auth: Secure authentication using cryptographic signatures stored in device keystore{'\n'}
            • Enable/Disable: Manage biometric authentication settings for the app{'\n'}
            • Device credentials fallback is supported on Android API 30+
          </Text>
        </View>
      </ScrollView>
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
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  demoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  demoButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  buttonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 