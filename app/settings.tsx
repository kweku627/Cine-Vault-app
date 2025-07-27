import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, GestureResponderEvent, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { UserActionsService } from '@/services/UserActionsService';
import { FeedbackApiService } from '@/services/FeedbackApiService';
import { useAuth } from '@/contexts/AuthContext';
import BiometricSetupModal from '@/components/BiometricSetupModal';

interface SettingItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle?: string;
  value?: boolean | string;
  onValueChange?: ((value: boolean) => void | Promise<void>) | ((event: GestureResponderEvent) => void);
  type?: 'switch' | 'button';
}

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showAppVersion, setShowAppVersion] = useState(false);
  const [showSendFeedback, setShowSendFeedback] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const { user, logout, biometricAvailable, biometricEnabled, biometricRequired, setBiometricRequired } = useAuth();

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and may improve app performance. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => console.log('Cache cleared') }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setAutoDownload(false);
            setWifiOnly(true);
            setAutoPlay(true);
            setHighQuality(false);
          }
        }
      ]
    );
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      await UserActionsService.changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user?.id) {
              Alert.alert('Error', 'User ID not found. Please try again later.');
              return;
            }
            setDeletingAccount(true);
            try {
              await UserActionsService.deleteAccount(user.id);
              Alert.alert('Account Deleted', 'Your account has been deleted.');
              await logout();
              router.replace('/auth');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account');
            } finally {
              setDeletingAccount(false);
            }
          },
        },
      ]
    );
  };

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback message.');
      return;
    }

    setSendingFeedback(true);
    try {
      await FeedbackApiService.sendFeedback({
        message: feedbackText.trim(),
        category: 'General',
      });
      
      Alert.alert('Success', 'Thank you for your feedback! We\'ll review it shortly.');
      setShowSendFeedback(false);
      setFeedbackText('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send feedback. Please try again.');
    } finally {
      setSendingFeedback(false);
    }
  };

  const SettingItem = ({ icon: Icon, title, subtitle, value, onValueChange, type = 'switch' }: SettingItemProps) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
      {type === 'button' && onValueChange ? (
        <TouchableOpacity 
          style={styles.settingItemTouchable}
          onPress={onValueChange as (event: GestureResponderEvent) => void}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.card }]}>
              <Icon size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
              {subtitle && <Text style={[styles.settingSubtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.card }]}>
              <Icon size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
              {subtitle && <Text style={[styles.settingSubtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>}
            </View>
          </View>
          {type === 'switch' && typeof value === 'boolean' && onValueChange && (
            <Switch
              value={value}
              onValueChange={onValueChange as (value: boolean) => void | Promise<void>}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          )}
        </>
      )}
    </View>
  );

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account</Text>
          <SettingItem
            icon={() => <Ionicons name="key" size={20} color={theme.colors.primary} />}
            title="Change Password"
            subtitle="Update your account password"
            type="button"
            onValueChange={() => setShowChangePassword(true)}
          />
          {biometricAvailable && (
            <>
              <SettingItem
                icon={() => <Ionicons name="finger-print" size={20} color={theme.colors.primary} />}
                title="Biometric Authentication"
                subtitle={biometricEnabled ? "Enabled - Use fingerprint or face ID" : "Disabled - Setup fingerprint or face ID login"}
                type="button"
                onValueChange={() => setShowBiometricSetup(true)}
              />
              {biometricEnabled && (
                <SettingItem
                  icon={() => <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />}
                  title="Require Biometric on App Launch"
                  subtitle={biometricRequired ? "Enabled - Must authenticate each time" : "Disabled - Skip biometric on launch"}
                  value={biometricRequired}
                  onValueChange={setBiometricRequired}
                  type="switch"
                />
              )}
            </>
          )}
          <SettingItem
            icon={() => <Ionicons name="trash" size={20} color={theme.colors.error} />}
            title="Delete Account"
            subtitle="Permanently delete your account"
            type="button"
            onValueChange={handleDeleteAccount}
          />
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>General</Text>
          <SettingItem
            icon={() => <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={theme.colors.primary} />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            value={isDark}
            onValueChange={toggleTheme}
            type="switch"
          />
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App</Text>
          <SettingItem
            icon={() => <Ionicons name="information-circle" size={20} color={theme.colors.primary} />}
            title="App Version"
            subtitle="Cine Vault v1.0.0"
            type="button"
            onValueChange={() => setShowAppVersion(true)}
          />
          <SettingItem
            icon={() => <Ionicons name="chatbox-ellipses" size={20} color={theme.colors.primary} />}
            title="Send Feedback"
            subtitle="Let us know your thoughts"
            type="button"
            onValueChange={() => setShowSendFeedback(true)}
          />
          <SettingItem
            icon={() => <Ionicons name="help-circle" size={20} color={theme.colors.primary} />}
            title="About"
            subtitle="Learn more about Cine Vault"
            type="button"
            onValueChange={() => setShowAbout(true)}
          />
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePassword}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, width: '85%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text }}>Change Password</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, marginBottom: 12, padding: 10, color: theme.colors.text }}
              placeholder="Current Password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, marginBottom: 12, padding: 10, color: theme.colors.text }}
              placeholder="New Password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, marginBottom: 20, padding: 10, color: theme.colors.text }}
              placeholder="Confirm New Password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setShowChangePassword(false)} style={{ padding: 10 }}>
                <Text style={{ color: theme.colors.error, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangePassword} style={{ padding: 10 }}>
                {changingPassword ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Change</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* App Version Modal */}
      <Modal
        visible={showAppVersion}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAppVersion(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, width: '85%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text }}>App Version</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, textAlign: 'center' }}>Cine Vault v1.0.0</Text>
            <TouchableOpacity onPress={() => setShowAppVersion(false)} style={{ marginTop: 20, padding: 10 }}>
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Send Feedback Modal */}
      <Modal
        visible={showSendFeedback}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSendFeedback(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, width: '85%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text }}>Send Feedback</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, textAlign: 'center', marginBottom: 20 }}>
              We'd love to hear your thoughts about Cine Vault.
            </Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, marginBottom: 12, padding: 10, color: theme.colors.text }}
              placeholder="Your feedback..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={5}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity 
                onPress={() => setShowSendFeedback(false)} 
                style={{ padding: 10 }}
                disabled={sendingFeedback}
              >
                <Text style={{ color: theme.colors.error, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSendFeedback} 
                style={{ padding: 10 }}
                disabled={sendingFeedback}
              >
                {sendingFeedback ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAbout}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, width: '85%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text }}>About Cine Vault</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, textAlign: 'center', marginBottom: 20 }}>
              Cine Vault is your movie and series companion app.
            </Text>
            <TouchableOpacity onPress={() => setShowAbout(false)} style={{ marginTop: 10, padding: 10 }}>
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Optional: show loading indicator while deleting account */}
      {deletingAccount && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <ActivityIndicator size="large" color={theme.colors.error} />
        </View>
      )}

      {/* Biometric Setup Modal */}
      <BiometricSetupModal
        visible={showBiometricSetup}
        onClose={() => setShowBiometricSetup(false)}
        onSuccess={() => {
          Alert.alert('Success', 'Biometric authentication settings updated successfully!');
        }}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingItemTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});