import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { Snackbar } from 'react-native-paper';

export default function SignUpScreen1() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ firstName?: string; lastName?: string; email?: string; password?: string; confirmPassword?: string; dateOfBirth?: string }>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });

  const handleNext = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.dateOfBirth) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarVisible(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setSnackbarMessage('Passwords do not match');
      setSnackbarVisible(true);
      return;
    }

    if (formData.password.length < 6) {
      setSnackbarMessage('Password must be at least 6 characters');
      setSnackbarVisible(true);
      return;
    }

    // Store data and navigate to next screen
    router.push({
      pathname: '/auth/signup-2',
      params: { 
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
      }
    });
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
            <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Step 1 of 3: Basic Information
            </Text>

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, { backgroundColor: theme.colors.button }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.colors.border }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Form fields */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Text style={[styles.label, { color: theme.colors.text }]}>First Name *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="Enter first name"
                  placeholderTextColor={theme.colors.textMuted}
                  value={formData.firstName}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
                />
                {fieldErrors.firstName && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.firstName}</Text>}
              </View>
              <View style={styles.nameField}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Last Name *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="Enter last name"
                  placeholderTextColor={theme.colors.textMuted}
                  value={formData.lastName}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
                />
                {fieldErrors.lastName && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.lastName}</Text>}
              </View>
            </View>

            <Text style={[styles.label, { color: theme.colors.text }]}>Email *</Text>
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
              onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
            />
            {fieldErrors.email && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.email}</Text>}

            <Text style={[styles.label, { color: theme.colors.text }]}>Password *</Text>
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
                onChangeText={(value) => setFormData(prev => ({ ...prev, password: value }))}
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

            <Text style={[styles.label, { color: theme.colors.text }]}>Confirm Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Confirm your password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={theme.colors.textMuted} 
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.confirmPassword && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.confirmPassword}</Text>}

            <Text style={[styles.label, { color: theme.colors.text }]}>Date of Birth *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.dateOfBirth}
              onChangeText={(value) => setFormData(prev => ({ ...prev, dateOfBirth: value }))}
            />
            {fieldErrors.dateOfBirth && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.dateOfBirth}</Text>}

            {/* Next button */}
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.colors.button }]}
              onPress={handleNext}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.surface} />
              ) : (
                <Text style={[styles.submitButtonText, { color: theme.colors.surface }]}> 
                  NEXT
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to login */}
            <View style={styles.modeSwitchContainer}>
              <Text style={[styles.modeSwitchText, { color: theme.colors.textMuted }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth?mode=login')}>
                <Text style={[styles.modeSwitchLink, { color: theme.colors.button }]}>
                  Sign In
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
  nameRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  nameField: {
    flex: 1,
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