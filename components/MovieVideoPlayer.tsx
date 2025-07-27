import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { VideoScraperService } from '@/services/VideoScraperService';

const { width } = Dimensions.get('window');

interface MovieVideoPlayerProps {
  movieId: string;
  movieTitle: string;
  onVideoLoad?: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

export default function MovieVideoPlayer({ 
  movieId, 
  movieTitle, 
  onVideoLoad, 
  onError 
}: MovieVideoPlayerProps) {
  const { theme } = useTheme();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize video player with fallback URL
  const videoSource = videoUrl || `https://vidsrc.to/embed/movie/${movieId}`;
  const player = useVideoPlayer(videoSource, player => {
    player.loop = false;
    // Don't auto-play, let user control
  });

  useEffect(() => {
    loadVideo();
  }, [movieId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading video for movie:', movieId);
      const url = await VideoScraperService.getMovieVideoUrlWithFallback(movieId);
      
      console.log('Video URL loaded:', url);
      setVideoUrl(url);
      onVideoLoad?.(url);
      
    } catch (err: any) {
      console.error('Error loading video:', err);
      const errorMessage = err.message || 'Failed to load video';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadVideo();
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {movieTitle}
          </Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading video...
          </Text>
          <Text style={[styles.loadingSubtext, { color: theme.colors.textSecondary }]}>
            This may take a few seconds
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {movieTitle}
          </Text>
        </View>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            Video Unavailable
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={20} color={theme.colors.surface} />
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {movieTitle}
        </Text>
      </View>
      
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
          nativeControls
        />
      </View>
      
      <View style={styles.infoSection}>
        <Text style={[styles.movieTitle, { color: theme.colors.text }]}>
          {movieTitle}
        </Text>
        <Text style={[styles.videoStatus, { color: theme.colors.textSecondary }]}>
          {videoUrl?.includes('vidsrc.to') ? 'Streaming via Vidsrc' : 'Direct stream'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  videoContainer: {
    width: width,
    height: width * 9 / 16,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 