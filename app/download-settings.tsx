import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function DownloadSettingsScreen() {
  const { theme } = useTheme();
  const [wifiOnly, setWifiOnly] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState('HD');
  const [storageLocation, setStorageLocation] = useState('Internal');
  const [deleteAfterWatching, setDeleteAfterWatching] = useState(false);
  const [downloadLimit, setDownloadLimit] = useState('10');

  const handleClearDownloads = () => {
    Alert.alert(
      'Clear All Downloads',
      'This will delete all downloaded content. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => console.log('Downloads cleared') }
      ]
    );
  };

  const qualityOptions = ['SD', 'HD', '4K'];
  const storageOptions = ['Internal', 'SD Card'];
  const limitOptions = ['5', '10', '25', '50', 'Unlimited'];

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
        <Text style={styles.headerTitle}>Download Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Download Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Quality</Text>
          <View style={styles.optionsContainer}>
            {qualityOptions.map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.optionButton,
                  downloadQuality === quality && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setDownloadQuality(quality)}
              >
                <Text style={[
                  styles.optionText,
                  { color: downloadQuality === quality ? theme.colors.surface : theme.colors.textSecondary }
                ]}>
                  {quality}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionDescription}>
            Higher quality uses more storage space
          </Text>
        </View>

        {/* Network Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="wifi" size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>WiFi Only</Text>
                <Text style={styles.settingSubtitle}>Only download when connected to WiFi</Text>
              </View>
            </View>
            <Switch
              value={wifiOnly}
              onValueChange={setWifiOnly}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={wifiOnly ? theme.colors.surface : theme.colors.textMuted}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="download" size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto Download</Text>
                <Text style={styles.settingSubtitle}>Automatically download new episodes</Text>
              </View>
            </View>
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={autoDownload ? theme.colors.surface : theme.colors.textMuted}
            />
          </View>
        </View>

        {/* Storage Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="folder" size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Storage Location</Text>
                <Text style={styles.settingSubtitle}>Where to save downloads</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.valueButton}>
              <Text style={styles.valueText}>{storageLocation}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash" size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Delete After Watching</Text>
                <Text style={styles.settingSubtitle}>Auto-delete completed downloads</Text>
              </View>
            </View>
            <Switch
              value={deleteAfterWatching}
              onValueChange={setDeleteAfterWatching}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={deleteAfterWatching ? theme.colors.surface : theme.colors.textMuted}
            />
          </View>
        </View>

        {/* Download Limits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Limit</Text>
          <View style={styles.optionsContainer}>
            {limitOptions.map((limit) => (
              <TouchableOpacity
                key={limit}
                style={[
                  styles.optionButton,
                  downloadLimit === limit && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setDownloadLimit(limit)}
              >
                <Text style={[
                  styles.optionText,
                  { color: downloadLimit === limit ? theme.colors.surface : theme.colors.textSecondary }
                ]}>
                  {limit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionDescription}>
            Maximum number of downloads allowed
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.clearButton, { backgroundColor: theme.colors.error }]}
            onPress={handleClearDownloads}
          >
            <Ionicons name="trash" size={20} color={theme.colors.surface} />
            <Text style={[styles.clearButtonText, { color: theme.colors.surface }]}>
              Clear All Downloads
            </Text>
          </TouchableOpacity>
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
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  valueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});