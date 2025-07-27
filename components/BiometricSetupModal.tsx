import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { biometricService } from '@/services/BiometricService';

interface BiometricSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BiometricSetupModal({
  visible,
  onClose,
  onSuccess,
}: BiometricSetupModalProps) {
  const { theme } = useTheme();
  const { enableBiometric, disableBiometric, biometricEnabled } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sensorInfo, setSensorInfo] = useState<{
    available: boolean;
    biometryType: string | null;
    error?: string;
  }>({ available: false, biometryType: null });

  useEffect(() => {
    if (visible) {
      checkSensorAvailability();
    }
  }, [visible]);

  const checkSensorAvailability = async () => {
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
    }
  };

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    try {
      const result = await enableBiometric();
      if (result.success) {
        Alert.alert(
          'Success',
          'Biometric authentication has been enabled successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                onSuccess?.();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to enable biometric authentication');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableBiometric = async () => {
    Alert.alert(
      'Disable Biometric Authentication',
      'Are you sure you want to disable biometric authentication? You will need to use your password to sign in.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await disableBiometric();
              if (result.success) {
                Alert.alert('Success', 'Biometric authentication has been disabled');
                onClose();
              } else {
                Alert.alert('Error', result.error || 'Failed to disable biometric authentication');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'An unexpected error occurred');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusIcon = () => {
    if (!sensorInfo.available) return 'close-circle';
    if (biometricEnabled) return 'checkmark-circle';
    return 'finger-print';
  };

  const getStatusColor = () => {
    if (!sensorInfo.available) return theme.colors.error;
    if (biometricEnabled) return theme.colors.success;
    return theme.colors.primary;
  };

  const getStatusText = () => {
    if (!sensorInfo.available) return 'Biometric sensor not available';
    if (biometricEnabled) return 'Biometric authentication enabled';
    return 'Biometric authentication available';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Biometric Authentication
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Status Section */}
            <View style={styles.statusSection}>
              <Ionicons
                name={getStatusIcon()}
                size={48}
                color={getStatusColor()}
                style={styles.statusIcon}
              />
              <Text style={[styles.statusText, { color: theme.colors.text }]}>
                {getStatusText()}
              </Text>
              {sensorInfo.biometryType && (
                <Text style={[styles.biometryType, { color: theme.colors.textSecondary }]}>
                  {sensorInfo.biometryType}
                </Text>
              )}
            </View>

            {/* Information Section */}
            <View style={styles.infoSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                How it works
              </Text>
              <View style={styles.infoItem}>
                <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  Secure biometric authentication using your device's fingerprint or face recognition
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="key" size={20} color={theme.colors.primary} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  Cryptographic keys are stored securely in your device's keystore
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="lock-closed" size={20} color={theme.colors.primary} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  Your biometric data never leaves your device
                </Text>
              </View>
            </View>

            {/* Error Section */}
            {sensorInfo.error && (
              <View style={[styles.errorSection, { backgroundColor: theme.colors.error + '10' }]}>
                <Ionicons name="warning" size={20} color={theme.colors.error} />
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {sensorInfo.error}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              {biometricEnabled ? (
                <TouchableOpacity
                  style={[styles.button, styles.disableButton, { borderColor: theme.colors.error }]}
                  onPress={handleDisableBiometric}
                  disabled={isLoading}
                >
                  <Ionicons name="close-circle" size={20} color={theme.colors.error} />
                  <Text style={[styles.buttonText, { color: theme.colors.error }]}>
                    Disable Biometric
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.enableButton,
                    {
                      backgroundColor: sensorInfo.available ? theme.colors.primary : theme.colors.disabled,
                    },
                  ]}
                  onPress={handleEnableBiometric}
                  disabled={isLoading || !sensorInfo.available}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.colors.surface} size="small" />
                  ) : (
                    <Ionicons name="finger-print" size={20} color={theme.colors.surface} />
                  )}
                  <Text style={[styles.buttonText, { color: theme.colors.surface }]}>
                    {isLoading ? 'Setting up...' : 'Enable Biometric'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIcon: {
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  biometryType: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  errorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  actionSection: {
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  enableButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disableButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 