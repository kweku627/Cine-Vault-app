import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function HelpSupportScreen() {
  const { theme } = useTheme();

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you would like to contact us:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => Linking.openURL('mailto:support@cinevault.com') },
        { text: 'Phone', onPress: () => Linking.openURL('tel:+1234567890') }
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report Bug',
      'Thank you for helping us improve! Please describe the issue you encountered.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Report', onPress: () => console.log('Bug report sent') }
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'We value your feedback! Please share your thoughts about the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Feedback', onPress: () => console.log('Feedback sent') }
      ]
    );
  };

  const faqItems = [
    {
      question: 'How do I download content for offline viewing?',
      answer: 'Tap the download icon on any movie or episode. Downloads are available in the Downloads tab.'
    },
    {
      question: 'Can I watch on multiple devices?',
      answer: 'Yes! Your account works on up to 4 devices simultaneously with a Premium subscription.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'Go to Profile > Manage Subscription to cancel or modify your subscription plan.'
    },
    {
      question: 'Why is content not loading?',
      answer: 'Check your internet connection. If the issue persists, try restarting the app.'
    },
    {
      question: 'How do I change video quality?',
      answer: 'Tap the settings icon in the video player to adjust quality settings.'
    }
  ];

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleContactSupport}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="headset" size={24} color={theme.colors.surface} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Contact Support</Text>
              <Text style={styles.actionSubtitle}>Get help from our support team</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleReportBug}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning }]}>
              <Ionicons name="bug" size={24} color={theme.colors.surface} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Report a Bug</Text>
              <Text style={styles.actionSubtitle}>Help us fix issues you encounter</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleFeedback}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.success }]}>
              <Ionicons name="chatbubble-ellipses" size={24} color={theme.colors.surface} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Send Feedback</Text>
              <Text style={styles.actionSubtitle}>Share your thoughts and suggestions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqItems.map((item, index) => (
            <View key={index} style={[styles.faqCard, { backgroundColor: theme.colors.card }]}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.01.15</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>React Native</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={[styles.contactCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={20} color={theme.colors.primary} />
              <Text style={styles.contactText}>support@cinevault.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color={theme.colors.primary} />
              <Text style={styles.contactText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="time" size={20} color={theme.colors.primary} />
              <Text style={styles.contactText}>Mon-Fri, 9AM-6PM EST</Text>
            </View>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  faqCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  contactCard: {
    padding: 16,
    borderRadius: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});