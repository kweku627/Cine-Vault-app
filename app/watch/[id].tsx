import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import WebViewVideoPlayer from '@/components/WebViewVideoPlayer';
import { HomeApiService } from '@/services/MoviesApiService';
import { watchLaterApiService } from '@/services/WatchLaterApiService';

const { width } = Dimensions.get('window');

interface Movie {
  id: string;
  title: string;
  year: string | number;
  genre: string;
  description: string;
  poster: string;
  backdrop: string;
  rating: string;
  duration: string;
}

export default function WatchMovieScreen() {
  const params = useLocalSearchParams();
  const { id, title, year, genre, description, poster, backdrop, rating, duration } = params;
  const { theme } = useTheme();
  
  // Main movie state
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'details' | 'related'>('details');
  
  // Related movies state
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  
  // Watch later state
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [watchLaterLoading, setWatchLaterLoading] = useState(false);
  
  // Video player state
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error('Invalid movie ID');
        
        console.log('WatchMovieScreen - Received params:', params);
        console.log('WatchMovieScreen - Movie ID:', id);
        
        const movieData: Movie = {
          id: id.toString(),
          title: title?.toString() || 'Unknown Movie',
          year: year?.toString() || 'Unknown Year',
          genre: genre?.toString() || 'Unknown Genre',
          description: description?.toString() || 'No description available.',
          poster: poster?.toString() || '',
          backdrop: backdrop?.toString() || '',
          rating: rating?.toString() || 'NR',
          duration: duration?.toString() || 'Unknown',
        };
        
        console.log('WatchMovieScreen - Created movie data:', movieData);
        setMovie(movieData);
        
        // Check watch later status
        try {
          const isInList = await watchLaterApiService.checkIfInWatchLater(movieData.id);
          setIsInWatchLater(isInList);
        } catch (watchLaterError) {
          console.error('Error checking watch later status:', watchLaterError);
        }
        
      } catch (err: any) {
        console.error('WatchMovieScreen - Error loading movie:', err);
        setError(err.message || 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (activeTab !== 'related' || !movie?.genre) return;
      
      setRelatedLoading(true);
      try {
        const allMovies = await HomeApiService.getAllMovies();
        const related = allMovies.filter((m: any) => {
          const genreMatch = m.genre && movie.genre && 
                           m.genre.toLowerCase() === movie.genre.toLowerCase();
          return genreMatch && m.id?.toString() !== movie.id?.toString();
        }).slice(0, 10); // Limit to 10 related movies
        
        setRelatedMovies(related);
      } catch (relatedError) {
        console.error('Error fetching related movies:', relatedError);
        setRelatedMovies([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    
    fetchRelated();
  }, [activeTab, movie]);

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

  const handleVideoLoadStart = () => {
    setIsVideoLoading(true);
    setVideoError(false);
    console.log('WebView load started for movie:', movie?.id);
  };

  const handleVideoLoadEnd = () => {
    setIsVideoLoading(false);
    console.log('WebView load ended for movie:', movie?.id);
  };

  const handleVideoError = (error: any) => {
    setIsVideoLoading(false);
    setVideoError(true);
    console.log('WebView error for movie:', movie?.id, error);
  };

  const navigateToRelatedMovie = (relatedMovie: any) => {
    router.push({
      pathname: `/watch/${relatedMovie.id}`,
      params: {
        ...relatedMovie,
        year: relatedMovie.year?.toString() || 'Unknown',
      }
    });
  };

  const renderRelatedMovieItem = ({ item }: { item: any }) => {
    // Ensure poster is a valid URL
    let posterUrl = item.poster;
    if (!posterUrl || posterUrl === '' || posterUrl === undefined) {
      if (item.poster_path) {
        posterUrl = item.poster_path.startsWith('http')
          ? item.poster_path
          : `https://image.tmdb.org/t/p/w500${item.poster_path}`;
      } else {
        posterUrl = 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
      }
    }

    return (
      <TouchableOpacity
        style={[styles.relatedMovieCard, { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.primary }]}
        onPress={() => navigateToRelatedMovie(item)}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: posterUrl }} 
          style={[styles.relatedMoviePoster, { backgroundColor: theme.colors.border }]}
          defaultSource={{ uri: 'https://via.placeholder.com/300x450/333333/ffffff?text=Loading' }}
        />
        <View style={styles.relatedMovieInfo}>
          <Text style={[styles.relatedMovieTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.relatedMovieMeta, { color: theme.colors.textSecondary }]}>
            {item.year} • {item.genre}
          </Text>
          <Text style={[styles.relatedMovieDescription, { color: theme.colors.textMuted }]} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <ScrollView style={[styles.tabContent, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.movieInfoContainer}>
              <Text style={[styles.movieTitle, { color: theme.colors.text }]}>{movie?.title || 'Unknown Movie'}</Text>
              
              <View style={styles.movieMetadata}>
                <Text style={[styles.movieMetaText, { color: theme.colors.textSecondary }]}>{movie?.year?.toString() || 'Unknown Year'}</Text>
                <View style={[styles.metadataDot, { backgroundColor: theme.colors.textSecondary }]} />
                <Text style={[styles.movieMetaText, { color: theme.colors.textSecondary }]}>{movie?.rating || 'NR'}</Text>
                <View style={[styles.metadataDot, { backgroundColor: theme.colors.textSecondary }]} />
                <Text style={[styles.movieMetaText, { color: theme.colors.textSecondary }]}>{movie?.duration || 'Unknown'}</Text>
                <View style={[styles.metadataDot, { backgroundColor: theme.colors.textSecondary }]} />
                <Text style={[styles.movieMetaText, { color: theme.colors.textSecondary }]}>{movie?.genre || 'Unknown Genre'}</Text>
              </View>

              {movie?.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Synopsis</Text>
                  <Text style={[styles.movieDescription, { color: theme.colors.textSecondary }]}>{movie.description}</Text>
                </View>
              )}

              {/* Watch Later Button */}
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.watchLaterButton,
                    { 
                      backgroundColor: isInWatchLater ? theme.colors.surface : 'transparent',
                      borderColor: theme.colors.primary 
                    }
                  ]} 
                  onPress={handleWatchLater}
                  disabled={watchLaterLoading}
                >
                  {watchLaterLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <Ionicons 
                      name={isInWatchLater ? "checkmark-circle" : "bookmark-outline"} 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                  )}
                  <Text style={[styles.watchLaterButtonText, { color: theme.colors.primary }]}>
                    {isInWatchLater ? "Saved for Later" : "Save for Later"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );

      case 'related':
        return (
          <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Related Movies</Text>
            {relatedLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Finding related movies...</Text>
              </View>
            ) : relatedMovies.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="film-outline" size={64} color={theme.colors.textMuted} />
                <Text style={[styles.emptyText, { color: theme.colors.text }]}>No related movies found</Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Try exploring other genres</Text>
              </View>
            ) : (
              <FlatList
                data={relatedMovies}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={renderRelatedMovieItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.relatedMoviesList}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading movie...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centeredContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Oops! Something went wrong</Text>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>{error || 'Movie not found'}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} onPress={() => router.back()}>
            <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {movie.title}
        </Text>
        <TouchableOpacity style={styles.headerActionButton} onPress={handleWatchLater}>
          {watchLaterLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Ionicons 
              name={isInWatchLater ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isInWatchLater ? theme.colors.primary : theme.colors.text} 
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {isVideoLoading && (
          <View style={styles.videoLoadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.videoLoadingText, { color: theme.colors.surface }]}>Loading player...</Text>
          </View>
        )}
        {videoError && (
          <View style={styles.videoErrorOverlay}>
            <Ionicons name="warning-outline" size={48} color={theme.colors.error} />
            <Text style={[styles.videoErrorText, { color: theme.colors.surface }]}>Failed to load video</Text>
          </View>
        )}
        <WebViewVideoPlayer
          tmdbId={movie.id}
          type="movie"
          showLoadingOverlay={false}
          onLoadStart={handleVideoLoadStart}
          onLoadEnd={handleVideoLoadEnd}
          onError={handleVideoError}
        />
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'details' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: theme.colors.textSecondary },
            activeTab === 'details' && [styles.activeTabText, { color: theme.colors.primary }]
          ]}>
            Details
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'related' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setActiveTab('related')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: theme.colors.textSecondary },
            activeTab === 'related' && [styles.activeTabText, { color: theme.colors.primary }]
          ]}>
            Related Movies
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 16,
    flex: 1,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000000',
    position: 'relative',
  },
  videoLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoLoadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  videoErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoErrorText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E50914',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
  },
  activeTabText: {
    color: '#E50914',
  },
  tabContent: {
    flex: 1,
  },
  movieInfoContainer: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 34,
  },
  movieMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  movieMetaText: {
    fontSize: 16,
    fontWeight: '500',
  },
  metadataDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  movieDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtonContainer: {
    marginTop: 8,
  },
  watchLaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 12,
  },
  watchLaterButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  relatedMoviesList: {
    padding: 20,
  },
  relatedMovieCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    borderLeftWidth: 4,
  },
  relatedMoviePoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  relatedMovieInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  relatedMovieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  relatedMovieMeta: {
    fontSize: 14,
    marginBottom: 8,
  },
  relatedMovieDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});