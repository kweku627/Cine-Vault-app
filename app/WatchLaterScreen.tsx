import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { watchLaterApiService, WatchLaterItem } from '@/services/WatchLaterApiService';

export default function WatchLaterScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [watchLaterItems, setWatchLaterItems] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWatchLaterItems();
  }, []);

  const loadWatchLaterItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await watchLaterApiService.getWatchLaterItems();
      setWatchLaterItems(items);
    } catch (err) {
      console.error('Error loading watch later items:', err);
      setError('Failed to load watch later items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (item: WatchLaterItem) => {
    Alert.alert(
      'Remove from Watch Later',
      `Are you sure you want to remove "${item.title}" from your watch later list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await watchLaterApiService.removeFromWatchLater(item.contentId);
              setWatchLaterItems(prev => prev.filter(i => i.id !== item.id));
            } catch (err) {
              console.error('Error removing item:', err);
              Alert.alert('Error', 'Failed to remove item from watch later');
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (item: WatchLaterItem) => {
    if (item.type === 'movie') {
      router.push(`/watch/${item.contentId}`);
    } else if (item.type === 'series') {
      router.push(`/watch-series/${item.contentId}`);
    }
  };

  const renderItem = ({ item }: { item: WatchLaterItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
    >
      <Image
        source={
          item.poster && item.poster.trim() !== ''
            ? { uri: item.poster }
            : require('../assets/images/default-poster.png')
        }
        style={styles.poster}
      />
      <View style={styles.itemContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        {item.year && (
          <Text style={[styles.year, { color: theme.colors.textSecondary }]}>{item.year}</Text>
        )}
        {item.genre && (
          <Text style={[styles.genre, { color: theme.colors.textSecondary }]}>{item.genre}</Text>
        )}
        <View style={styles.typeContainer}>
          <Ionicons 
            name={item.type === 'movie' ? 'film' : 'tv'} 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.typeText, { color: theme.colors.primary }]}>
            {item.type === 'movie' ? 'Movie' : 'Series'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item)}
      >
        <Ionicons name="close-circle" size={24} color={theme.colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: theme.colors.text }]}>Watch Later</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading your watch later list...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: theme.colors.text }]}>Watch Later</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={loadWatchLaterItems}
          >
            <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* App Bar with Back Button */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.colors.text }]}>Watch Later</Text>
        <Text style={[styles.count, { color: theme.colors.textSecondary }]}>
          {watchLaterItems.length} items
        </Text>
      </View>

      {/* Content */}
      {watchLaterItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={theme.colors.textMuted} />
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            You haven't saved anything yet.
          </Text>
          <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
            Tap the bookmark icon on a movie or series to add it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={watchLaterItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
  },
  count: {
    fontSize: 14,
  },
  list: {
    gap: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  itemContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    marginBottom: 2,
  },
  genre: {
    fontSize: 14,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
