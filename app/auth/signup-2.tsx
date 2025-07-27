import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { Snackbar } from 'react-native-paper';

export default function SignUpScreen2() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    username: '',
  });

  // Get data from previous screen
  const [previousData, setPreviousData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{ phoneNumber?: string; username?: string }>({});

  useEffect(() => {
    if (params.firstName) {
      setPreviousData({
        firstName: params.firstName as string,
        lastName: params.lastName as string,
        email: params.email as string,
        password: params.password as string,
        dateOfBirth: params.dateOfBirth as string,
      });
    }
  }, [params]);

  const handleNext = () => {
    if (!formData.phoneNumber || !formData.username) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarVisible(true);
      return;
    }

    if (formData.username.length < 3) {
      setSnackbarMessage('Username must be at least 3 characters');
      setSnackbarVisible(true);
      return;
    }

    // Navigate to OTP verification screen with all data
    router.push({
      pathname: '/auth/signup-3',
      params: { 
        ...previousData,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
      }
    });
  };

  const handleBack = () => {
    router.back();
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
            <Text style={[styles.title, { color: theme.colors.text }]}>Additional Info</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Step 2 of 3: Contact & Username
            </Text>

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, { backgroundColor: theme.colors.button }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.colors.button }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Form fields */}
            <Text style={[styles.label, { color: theme.colors.text }]}>Phone Number *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter your phone number"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
            />
            {fieldErrors.phoneNumber && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.phoneNumber}</Text>}

            <Text style={[styles.label, { color: theme.colors.text }]}>Username *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Choose a username"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(value) => setFormData(prev => ({ ...prev, username: value }))}
            />
            {fieldErrors.username && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{fieldErrors.username}</Text>}

            {/* Navigation buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.backButton, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border 
                }]}
                onPress={handleBack}
              >
                <Text style={[styles.backButtonText, { color: theme.colors.text }]}>BACK</Text>
              </TouchableOpacity>
              
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
            </View>

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
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
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