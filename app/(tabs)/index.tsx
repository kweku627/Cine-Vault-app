import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { HomeApiService } from '@/services/MoviesApiService';
import { useTheme } from '@/contexts/ThemeContext';
import ContentGrid from '@/components/ContentGrid';
import FeaturedCarousel from '@/components/FeaturedCarousel';

const { width: screenWidth } = Dimensions.get('window');

// Define the new API movie interface
interface ApiMovie {
  id: number;
  title: string;
  overview: string;
  genre: string;
  poster_path: string;
  video_link: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const [movies, setMovies] = useState<ApiMovie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await HomeApiService.getAllMovies();
      console.log('Fetched movies:', data);
      if (!Array.isArray(data)) {
        console.error('API did not return an array:', data);
      }
      // Ensure each movie has a 'rating' property for ContentGrid
      const moviesWithRating = data.map((movie: any) => ({
        ...movie,
        rating: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
      }));
      setMovies(moviesWithRating);
      // Get top 5 trending movies (sorted by rating)
      const topTrendingMovies = moviesWithRating
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);
      console.log('Top 5 trending movies loaded:', topTrendingMovies.length);
      console.log('Featured movies data:', topTrendingMovies.map(m => ({ id: m.id, title: m.title, rating: m.rating })));
      setFeaturedMovies(topTrendingMovies);
    } catch (error) {
      console.error('Failed to load movies:', error);
      // Show error in UI for debugging
      setMovies([]);
      setFeaturedMovies([]);
    }
  };

  const handleContentPress = (content: any) => {
    console.log('Navigating to movie:', content.title, 'with id:', content.id);
    console.log('Movie data:', content);
    router.push({
      pathname: `/watch/${content.id}`,
      params: {
        title: content.title,
        year: content.year?.toString() || new Date().getFullYear().toString(),
        genre: content.genre,
        description: content.description,
        poster: content.poster,
        backdrop: content.backdrop,
        rating: content.voteAverage?.toString() || '0',
        duration: content.duration?.toString() || '120'
      }
    });
  };

  const styles = createStyles(theme);

  console.log('HomeScreen: Rendering with movies count:', movies.length, 'and numColumns=3');

  // Create a single list of items with different types
  const listItems = [
    { id: 'header', type: 'header' },
    { id: 'featured', type: 'featured', data: featuredMovies },
    { id: 'section-title', type: 'section-title' },
    { id: 'movies', type: 'movies', data: movies }
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/WatchLaterScreen')}>
              <Ionicons name="play-circle" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Cine vault</Text>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <View style={[styles.profileContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      
      case 'featured':
        if (featuredMovies.length > 0) {
          return (
            <FeaturedCarousel
              content={featuredMovies}
              height={300}
              onContentPress={handleContentPress}
            />
          );
        } else {
          return (
            <View style={styles.carouselPlaceholder}>
              <Text style={[styles.carouselPlaceholderText, { color: theme.colors.textMuted }]}>
                Loading trending movies...
              </Text>
            </View>
          );
        }
      
      case 'section-title':
        return (
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>All Movies</Text>
        );
      
      case 'movies':
        return (
          <View style={styles.moviesContainer}>
            <ContentGrid content={movies} numColumns={3} onContentPress={handleContentPress} />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  profileContainer: { overflow: 'hidden', width: 32, height: 32, borderRadius: 16, borderWidth: 2 },
  profileImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  moviesContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  carouselPlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  carouselPlaceholderText: {
    fontSize: 16,
  },
});