import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { Snackbar } from 'react-native-paper';
import { AuthApiService } from '@/services/AuthApiService';

export default function SignUpScreen3() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    username?: string;
  }>({});
  const [registrationData, setRegistrationData] = useState<any>({});

  useEffect(() => {
    // Collect all registration data from previous steps
    setRegistrationData({
      firstName: params.firstName || '',
      lastName: params.lastName || '',
      email: params.email || '',
      password: params.password || '',
      phoneNumber: params.phoneNumber || '',
      username: params.username || '',
      dateOfBirth: params.dateOfBirth || '',
    });
  }, [params]);

  const handleRegister = async () => {
    setFieldErrors({});
    setLoading(true);
    try {
      const data = await AuthApiService.register(registrationData);
      console.log('JWT Token:', data.token);
      setSnackbarMessage('Registration successful!');
      setSnackbarVisible(true);
      // AuthRedirector will handle navigation based on biometric authentication status
    } catch (error: any) {
      let message = 'Registration failed';
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object' && !data.message) {
          setFieldErrors(data);
          message = Object.values(data).join(', ');
        } else if (data.message) {
          message = data.message;
        }
      }
      setSnackbarMessage(message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header with gradient */}
          <LinearGradient
            colors={theme.gradients.primary as [string, string]}
            style={styles.headerGradient}
          >
            <View style={styles.logoContainer}>
              <View style={[styles.logoCircle, { backgroundColor: theme.colors.surface }]}> 
                <Ionicons name="medical" size={40} color={theme.colors.primary} />
              </View>
            </View>
          </LinearGradient>

          {/* Main content card */}
          <View style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.title, { color: theme.colors.text }]}>Confirm Registration</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Step 3 of 3: Review and Complete</Text>

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, { backgroundColor: theme.colors.button }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.colors.button }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.colors.button }]} />
            </View>

            {/* Show summary or just a message */}
            <Text style={[styles.label, { color: theme.colors.text }]}>You're almost done! Tap below to complete your registration.</Text>
            {/* Optionally, show a summary of entered data here */}

            {/* Field errors (if any) */}
            {Object.entries(fieldErrors).map(([field, error]) => (
              error ? <Text key={field} style={{ color: theme.colors.error, marginBottom: 8 }}>{error}</Text> : null
            ))}

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.colors.button }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.surface} />
              ) : (
                <Text style={[styles.submitButtonText, { color: theme.colors.surface }]}> 
                  REGISTER
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.modeSwitchContainer}>
              <Text style={[styles.modeSwitchText, { color: theme.colors.textMuted }]}>Already have an account?{' '}</Text>
              <TouchableOpacity onPress={() => router.push('/auth?mode=login')}>
                <Text style={[styles.modeSwitchLink, { color: theme.colors.button }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[styles.snackbar, { backgroundColor: theme.colors.error }]}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contentCard: {
    flex: 1,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  progressStep: {
    width: 30,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeSwitchText: {
    fontSize: 14,
  },
  modeSwitchLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  snackbar: {
    marginBottom: 20,
  },
}); 