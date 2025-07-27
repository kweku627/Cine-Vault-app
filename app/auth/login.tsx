import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Snackbar } from 'react-native-paper';
import BiometricLoginButton from '@/components/BiometricLoginButton';
import BiometricSetupModal from '@/components/BiometricSetupModal';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login, biometricAvailable, biometricEnabled } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    console.log('Login form submitted with:', { email: formData.email, password: formData.password ? '***' : 'empty' });
    
    setFieldErrors({});
    if (!formData.email || !formData.password) {
      console.log('Form validation failed: missing required fields');
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Calling login from AuthContext...');
      await login(formData.email, formData.password);
      console.log('Login successful, AuthRedirector will handle navigation...');
      // AuthRedirector will handle navigation based on biometric authentication status
    } catch (error: any) {
      console.error('Login error caught in component:', error);
      
      // Robust error feedback
      let message = 'Login failed';
      if (error?.response?.data) {
        const data = error.response.data;
        console.log('Error response data:', data);
        if (typeof data === 'object' && !data.message) {
          // Field errors
          console.log('Setting field errors:', data);
          setFieldErrors(data);
          message = Object.values(data).join(', ');
        } else if (data.message) {
          message = data.message;
        }
      } else {
        console.log('No error.response.data found, using generic message');
      }
      
      console.log('Setting snackbar message:', message);
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
            <Text style={[styles.title, { color: theme.colors.text }]}>Sign In</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Welcome back! Please sign in to your account
            </Text>

            {/* Form fields */}
            <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => {
                console.log('Email changed to:', value);
                setFormData(prev => ({ ...prev, email: value }));
              }}
            />
            {fieldErrors.email && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.email}</Text>}

            <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(value) => {
                  console.log('Password changed to:', value ? '***' : 'empty');
                  setFormData(prev => ({ ...prev, password: value }));
                }}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={theme.colors.textMuted} 
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.password && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.password}</Text>}

            {/* Remember me and forgot password */}
            <View style={styles.rememberForgotRow}>
              <TouchableOpacity 
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, { 
                  backgroundColor: rememberMe ? theme.colors.button : theme.colors.card,
                  borderColor: theme.colors.border 
                }]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color={theme.colors.surface} />
                  )}
                </View>
                <Text style={[styles.rememberMeText, { color: theme.colors.text }]}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Submit button */}
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.colors.button }]}
              onPress={() => {
                console.log('Submit button pressed');
                handleSubmit();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.surface} />
              ) : (
                <Text style={[styles.submitButtonText, { color: theme.colors.surface }]}> 
                  SIGN IN
                </Text>
              )}
            </TouchableOpacity>

            {/* Biometric login button */}
            {biometricAvailable && (
              <BiometricLoginButton
                onSuccess={() => {
                  console.log('Biometric login successful');
                  // AuthRedirector will handle navigation based on biometric authentication status
                }}
                onError={(error) => {
                  console.error('Biometric login error:', error);
                  setSnackbarMessage(error);
                  setSnackbarVisible(true);
                }}
                onFallback={() => {
                  console.log('User chose to use password instead');
                }}
                style={styles.biometricButton}
                disabled={loading}
              />
            )}

            {/* Biometric setup option */}
            {biometricAvailable && !biometricEnabled && (
              <TouchableOpacity
                style={[styles.biometricSetupButton, { borderColor: theme.colors.primary }]}
                onPress={() => setShowBiometricSetup(true)}
              >
                <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.biometricSetupText, { color: theme.colors.primary }]}>
                  Setup Biometric Login
                </Text>
              </TouchableOpacity>
            )}

            {/* Social login options */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textMuted }]}>or continue with</Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877F2' }]}>
                <Ionicons name="logo-facebook" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
                <Ionicons name="logo-google" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#E4405F' }]}>
                <Ionicons name="logo-instagram" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Mode switch */}
            <View style={styles.modeSwitchContainer}>
              <Text style={[styles.modeSwitchText, { color: theme.colors.textMuted }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth?mode=register')}>
                <Text style={[styles.modeSwitchLink, { color: theme.colors.button }]}>
                  Sign Up
                </Text>
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

      {/* Biometric Setup Modal */}
      <BiometricSetupModal
        visible={showBiometricSetup}
        onClose={() => setShowBiometricSetup(false)}
        onSuccess={() => {
          setSnackbarMessage('Biometric authentication enabled successfully!');
          setSnackbarVisible(true);
        }}
      />
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
    marginBottom: 30,
    lineHeight: 22,
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
  passwordContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  passwordInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 50,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
  biometricButton: {
    marginBottom: 15,
  },
  biometricSetupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  biometricSetupText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 