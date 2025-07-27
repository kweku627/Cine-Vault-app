import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ContentGrid from '@/components/ContentGrid';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import { SeriesApiService } from '@/services/SeriesApiService';
import { useTheme } from '@/contexts/ThemeContext';

export default function SeriesScreen() {
  const { theme } = useTheme();
  const [seriesContent, setSeriesContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  useEffect(() => {
    loadSeriesData();
  }, []);

  const loadSeriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allSeriesResponse, allGenres] = await Promise.all([
        SeriesApiService.getContentByType('SERIES'),
        SeriesApiService.getAllGenres()
      ]);
      setSeriesContent(allSeriesResponse.content);
      setGenres(['all', ...allGenres]);
    } catch (error) {
      setError('Failed to load series. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentPress = (content: any) => {
    router.push(`/watch-series/${content.id}`);
  };

  // Filter by genre if selected
  const filteredContent = selectedGenre === 'all'
    ? seriesContent
    : seriesContent.filter((item: any) =>
        Array.isArray(item.genres)
          ? item.genres.map((g: string) => g.toLowerCase()).includes(selectedGenre.toLowerCase())
          : false
      );

  // Prepare featured series (first 5)
  const featuredSeries = filteredContent.slice(0, 5);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading series...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={loadSeriesData}
        >
          <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Series</Text>
      </View>
      {/* Featured Carousel */}
      {featuredSeries.length > 0 && (
        <FeaturedCarousel
          content={featuredSeries}
          height={250}
          onContentPress={handleContentPress}
        />
      )}
      <View style={styles.genreFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {genres.map((genre: string) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.genreButton,
                { backgroundColor: theme.colors.card },
                selectedGenre === genre && { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text style={[
                styles.genreButtonText,
                { color: selectedGenre === genre ? theme.colors.surface : theme.colors.textSecondary }
              ]}>
                {genre === 'all' ? 'All' : genre.charAt(0).toUpperCase() + genre.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ContentGrid 
        content={filteredContent} 
        numColumns={3} 
        onContentPress={handleContentPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
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
  },
  searchButton: {
    padding: 8,
  },
  genreFilter: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  genreButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});