import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ManageSubscriptionScreen() {
  const { theme } = useTheme();

  const handleChangePlan = () => {
    Alert.alert('Change Plan', 'Change plan functionality would be implemented here.');
  };

  const handleCancel = () => {
    Alert.alert('Cancel Subscription', 'Are you sure you want to cancel your subscription?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
      <Text style={[styles.title, { color: theme.colors.text }]}>Manage Subscription</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.card }] }>
        <Ionicons name="card" size={48} color={theme.colors.primary} style={{ marginBottom: 16 }} />
        <Text style={[styles.plan, { color: theme.colors.text }]}>Cine vault Premium</Text>
        <Text style={[styles.price, { color: theme.colors.primary }]}>$9.99/month</Text>
        <Text style={[styles.status, { color: theme.colors.success }]}>Status: Active</Text>
        <Text style={[styles.nextBilling, { color: theme.colors.textMuted }]}>Next billing: 2024-08-01</Text>
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleChangePlan}>
        <Text style={[styles.buttonText, { color: theme.colors.surface }]}>Change Plan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.error }]} onPress={handleCancel}>
        <Text style={[styles.buttonText, { color: theme.colors.surface }]}>Cancel Subscription</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  card: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
  },
  plan: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    marginBottom: 4,
  },
  nextBilling: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 