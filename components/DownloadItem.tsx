import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Download } from '@/types/content';

interface DownloadItemProps {
  content: Download;
  onDelete: () => void;
}

export default function DownloadItem({ content, onDelete }: DownloadItemProps) {
  const { theme } = useTheme();

  const handlePlay = () => {
    router.push(`/movie/${content.id}`);
  };

  const formatSize = (size: number) => {
    if (size >= 1) {
      return size.toFixed(1) + ' GB';
    }
    return (size * 1024).toFixed(0) + ' MB';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={handlePlay}>
        <Image
          source={{ uri: content.poster }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {content.title}
          </Text>
          <Text style={styles.details}>
            {content.year} • {formatDuration(content.duration || 120)}
          </Text>
          <Text style={styles.size}>
            Downloaded • {formatSize(content.size || 1.2)}
          </Text>
        </View>
        <TouchableOpacity style={[styles.playButton, { backgroundColor: theme.colors.primary }]} onPress={handlePlay}>
          <Ionicons name="play" size={16} color={theme.colors.surface} />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  size: {
    fontSize: 12,
    color: theme.colors.success,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deleteButton: {
    padding: 8,
  },
});