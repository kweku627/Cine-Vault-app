import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DownloadItem from '@/components/DownloadItem';
import { ContentService } from '@/services/ContentService';
import { useTheme } from '@/contexts/ThemeContext';
import { Download as DownloadType } from '@/types/content';

export default function DownloadsScreen() {
  const { theme } = useTheme();
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(32);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const downloadedContent = await ContentService.getDownloads();
      setDownloads(downloadedContent);
      
      const totalSize = downloadedContent.reduce((sum, item) => sum + (item.size || 0), 0);
      setStorageUsed(totalSize);
    } catch (error) {
      console.error('Failed to load downloads:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Download',
      'Are you sure you want to delete this download?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ContentService.deleteDownload(id);
              await loadDownloads();
            } catch (error) {
              console.error('Failed to delete download:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    if (downloads.length === 0) return;

    Alert.alert(
      'Delete All Downloads',
      'Are you sure you want to delete all downloads?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await ContentService.deleteAllDownloads();
              await loadDownloads();
            } catch (error) {
              console.error('Failed to delete all downloads:', error);
            }
          },
        },
      ]
    );
  };

  const formatStorage = (gb: number) => {
    return gb.toFixed(1) + ' GB';
  };

  const storagePercentage = (storageUsed / storageLimit) * 100;

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Downloads</Text>
        <TouchableOpacity style={[styles.settingsButton, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="settings" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.storageContainer}>
        <View style={styles.storageInfo}>
          <Text style={styles.storageText}>
            {formatStorage(storageUsed)} of {formatStorage(storageLimit)} used
          </Text>
          <TouchableOpacity onPress={handleDeleteAll}>
            <Text style={[styles.deleteAllText, { color: theme.colors.error }]}>Delete All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.storageBar, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.storageProgress, 
              { 
                width: `${Math.min(storagePercentage, 100)}%`,
                backgroundColor: storagePercentage > 80 ? theme.colors.error : theme.colors.primary
              }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {downloads.length > 0 ? (
          <View style={styles.downloadsContainer}>
            {downloads.map((item) => (
              <DownloadItem
                key={item.id}
                content={item}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="download" size={64} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>No Downloads</Text>
            <Text style={styles.emptyDescription}>
              Download movies and shows to watch offline
            </Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
  },
  storageContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageText: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  deleteAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  storageBar: {
    height: 4,
    borderRadius: 2,
  },
  storageProgress: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  downloadsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});