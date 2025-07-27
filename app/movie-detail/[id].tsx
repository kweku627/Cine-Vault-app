import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { watchLaterApiService } from '@/services/WatchLaterApiService';

const { width, height } = Dimensions.get('window');

interface MovieDetails {
  id: string;
  title: string;
  year: number;
  rating: string;
  duration: string;
  description: string;
  poster: string;
  backdrop: string;
  cast: string;
  director: string;
  genre: string;
}

export default function MovieDetailScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [watchLaterLoading, setWatchLaterLoading] = useState(false);

  useEffect(() => {
    loadMovieDetails();
  }, []);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockMovie: MovieDetails = {
        id: params.id as string,
        title: params.title as string || 'LION',
        year: parseInt(params.year as string) || 2016,
        rating: 'PG-13',
        duration: '1h 58m',
        description: 'An Indian man who was separated from his mother at age 5 and adopted by an Australian couple returns home, determined to find his family.',
        poster: params.poster as string || 'https://images.pexels.com/photos/33053/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
        backdrop: params.backdrop as string || 'https://images.pexels.com/photos/33053/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
        cast: 'Dev Patel, Rooney Mara, David Wenham',
        director: 'Garth Davis',
        genre: params.genre as string || 'Drama',
      };
      
      setMovie(mockMovie);
      
      // Check if movie is in watch later
      try {
        const isInList = await watchLaterApiService.checkIfInWatchLater(mockMovie.id);
        setIsInWatchLater(isInList);
      } catch (error) {
        console.error('Error checking watch later status:', error);
      }
    } catch (error) {
      console.error('Failed to load movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (movie) {
      router.push({
        pathname: `/watch/${movie.id}`,
        params: {
          title: movie.title,
          year: movie.year.toString(),
          genre: movie.genre,
          description: movie.description,
          poster: movie.poster,
          backdrop: movie.backdrop,
        }
      });
    }
  };

  const handleWatchLater = async () => {
    if (!movie || watchLaterLoading) return;

    console.log('🎬 Watch Later button pressed for movie:', movie.title);
    
    try {
      setWatchLaterLoading(true);
      
      if (isInWatchLater) {
        console.log('🗑️ Removing from watch later...');
        await watchLaterApiService.removeFromWatchLater(movie.id);
        setIsInWatchLater(false);
        console.log('✅ Removed from watch later');
      } else {
        console.log('➕ Adding to watch later...');
        const result = await watchLaterApiService.addMovieToWatchLater({
          id: movie.id,
          title: movie.title,
          description: movie.description,
          poster: movie.poster,
          backdrop: movie.backdrop,
          year: movie.year.toString(),
          genre: movie.genre,
          duration: movie.duration,
          rating: movie.rating,
        });
        setIsInWatchLater(true);
        console.log('✅ Added to watch later:', result);
      }
    } catch (error) {
      console.error('❌ Failed to update watch later:', error);
    } finally {
      setWatchLaterLoading(false);
    }
  };

  const handleRate = () => {
    console.log('Rate movie');
  };

  const handleShare = () => {
    console.log('Share movie');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Movie not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Header with Close Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Movie Poster */}
        <View style={styles.posterContainer}>
          <Image source={{ uri: movie.poster }} style={styles.poster} resizeMode="cover" />
        </View>
        
        {/* Movie Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.title}</Text>
        </View>

        {/* Movie Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>{movie.year}</Text>
          <View style={styles.metadataDot} />
          <Text style={styles.metadataText}>{movie.rating}</Text>
          <View style={styles.metadataDot} />
          <Text style={styles.metadataText}>{movie.duration}</Text>
          <View style={styles.metadataDot} />
          <Text style={styles.metadataText}>{movie.genre}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Play Button */}
          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <Ionicons name="play" size={24} color="#FFFFFF" />
            <Text style={styles.playButtonText}>PLAY</Text>
          </TouchableOpacity>

          {/* Watch Later Button */}
          <TouchableOpacity 
            style={[
              styles.watchLaterButton, 
              { 
                backgroundColor: isInWatchLater ? '#333333' : 'transparent',
                opacity: watchLaterLoading ? 0.7 : 1
              }
            ]} 
            onPress={handleWatchLater}
            disabled={watchLaterLoading}
          >
            {watchLaterLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons 
                name={isInWatchLater ? "checkmark-circle" : "add-circle-outline"} 
                size={24} 
                color="#FFFFFF" 
              />
            )}
            <Text style={styles.watchLaterButtonText}>
              {isInWatchLater ? "Added to Watch Later" : "Add to Watch Later"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Synopsis */}
        <View style={styles.synopsisContainer}>
          <Text style={styles.synopsisTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>{movie.description}</Text>
        </View>

        {/* Cast & Crew Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Cast</Text>
            <Text style={styles.infoText}>{movie.cast}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Director</Text>
            <Text style={styles.infoText}>{movie.director}</Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.bottomActionButton} onPress={handleWatchLater}>
          <Ionicons 
            name={isInWatchLater ? "checkmark-circle" : "bookmark-outline"} 
            size={24} 
            color={isInWatchLater ? "#E50914" : "#FFFFFF"} 
          />
          <Text style={[
            styles.bottomActionText, 
            { color: isInWatchLater ? "#E50914" : "#FFFFFF" }
          ]}>
            {isInWatchLater ? "Saved" : "Watch Later"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomActionButton} onPress={handleRate}>
          <Ionicons name="thumbs-up-outline" size={24} color="#FFFFFF" />
          <Text style={styles.bottomActionText}>Rate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomActionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          <Text style={styles.bottomActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  posterContainer: {
    width: width,
    height: width * 1.4,
    backgroundColor: '#111111',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexWrap: 'wrap',
  },
  metadataText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  metadataDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 8,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  watchLaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  watchLaterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  synopsisContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  synopsisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  bottomActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  bottomActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});