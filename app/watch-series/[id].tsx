import React, { useState, useEffect, useRef } from 'react';
import { 
  FlatList, 
  ListRenderItem, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions, 
  StatusBar,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { SeriesApiService } from '@/services/WatchSeriesApiService';
import { SeriesInfo, Season, Episode } from '@/types/series';
import { watchLaterApiService } from '@/services/WatchLaterApiService';
import WebViewVideoPlayer from '@/components/WebViewVideoPlayer';

const { width, height } = Dimensions.get('window');

interface WatchSeriesParams {
  id?: string;
  uri?: string;
  title?: string;
}

export default function WatchSeriesScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const { id, uri, title } = params as WatchSeriesParams;
  
  // Series and episode state
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('1');
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [showControls, setShowControls] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'episodes' | 'details'>('episodes');
  const [useWebView, setUseWebView] = useState<boolean>(false);
  
  // Watch later state
  const [isInWatchLater, setIsInWatchLater] = useState<boolean>(false);
  const [watchLaterLoading, setWatchLaterLoading] = useState<boolean>(false);
  
  // Video player state
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadSeriesData();
  }, []);

  const loadSeriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) {
        throw new Error('Series ID is required');
      }
      
      console.log('Loading series data for ID:', id);
      const seriesData = await SeriesApiService.getSeriesDetails(id);
      console.log('Series data loaded:', seriesData);
      
      setSeriesInfo(seriesData.seriesInfo);
      setSeasons(seriesData.seasons);
      
      // Set initial episode if seasons and episodes exist
      if (seriesData.seasons.length > 0 && seriesData.seasons[0].episodes.length > 0) {
        setSelectedEpisode(seriesData.seasons[0].episodes[0].id);
        setSelectedSeason(seriesData.seasons[0].season);
        console.log('Initial episode set:', seriesData.seasons[0].episodes[0].id);
      }
      
      // Check watch later status
      try {
        const isInList = await watchLaterApiService.checkIfInWatchLater(id);
        setIsInWatchLater(isInList);
      } catch (watchLaterError) {
        console.error('Error checking watch later status:', watchLaterError);
      }
      
    } catch (error) {
      console.error('Failed to load series data:', error);
      setError('Failed to load series data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchLater = async () => {
    if (!seriesInfo || watchLaterLoading) return;

    console.log('🎬 Watch Later button pressed for series:', seriesInfo.title);
    
    try {
      setWatchLaterLoading(true);
      
      if (isInWatchLater) {
        console.log('🗑️ Removing from watch later...');
        await watchLaterApiService.removeFromWatchLater(seriesInfo.id);
        setIsInWatchLater(false);
        console.log('✅ Removed from watch later');
      } else {
        console.log('➕ Adding to watch later...');
        const result = await watchLaterApiService.addMovieToWatchLater({
          id: seriesInfo.id,
          title: seriesInfo.title,
          description: seriesInfo.description,
          poster: seriesInfo.poster,
          backdrop: seriesInfo.backdrop || seriesInfo.poster,
          year: seriesInfo.year.toString(),
          genre: seriesInfo.genre,
          duration: `${seriesInfo.totalSeasons} Season${seriesInfo.totalSeasons !== 1 ? 's' : ''}`,
          rating: seriesInfo.rating.toString(),
        });
        setIsInWatchLater(true);
        console.log('✅ Added to watch later:', result);
      }
    } catch (error) {
      console.error('❌ Failed to update watch later:', error);
      Alert.alert('Error', 'Failed to update watch later. Please try again.');
    } finally {
      setWatchLaterLoading(false);
    }
  };

  const currentSeason = seasons.find((s) => s.season === selectedSeason);
  const currentEpisode = currentSeason?.episodes.find((e) => e.id === selectedEpisode);
  
  // Check if we should use WebView for embed URLs
  const videoUrl = currentEpisode?.uri || uri || `https://vidsrc.to/embed/tv/${id}`;
  const shouldUseWebView = videoUrl?.includes('vidsrc.to') || videoUrl?.includes('embed') || useWebView;
  
  console.log('Video URL:', videoUrl);
  console.log('Should use WebView:', shouldUseWebView);
  
  // Initialize video player only for direct video URLs
  const videoSource = shouldUseWebView ? null : (videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const player = useVideoPlayer(videoSource || '', player => {
    player.loop = false;
    // Don't auto-play, let user control
  });
  const playerIsPlaying = player?.playing ?? false;
  const playerCurrentTime = player?.currentTime ?? 0;
  const playerDuration = player?.duration ?? 0;

  useEffect(() => {
    if (showControls && !shouldUseWebView) {
      resetControlsTimeout();
    }
  }, [showControls, shouldUseWebView]);

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleScreenPress = () => {
    if (!shouldUseWebView) {
      setShowControls(!showControls);
    }
  };

  const handlePlayPause = () => {
    if (player) {
      if (playerIsPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  const handleVideoLoadStart = () => {
    setIsVideoLoading(true);
    setVideoError(false);
    console.log('WebView load started for series:', id);
  };

  const handleVideoLoadEnd = () => {
    setIsVideoLoading(false);
    console.log('WebView load ended for series:', id);
  };

  const handleVideoError = (error: any) => {
    setIsVideoLoading(false);
    setVideoError(true);
    console.log('WebView error for series:', id, error);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const navigateToEpisode = (episode: Episode, seasonNumber: number) => {
    setSelectedEpisode(episode.id);
    setSelectedSeason(seasonNumber);
  };

  const renderSeason: ListRenderItem<Season> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.seasonButton,
        { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
        selectedSeason === item.season && [styles.selectedSeasonButton, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]
      ]}
      onPress={() => setSelectedSeason(item.season)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.seasonText,
        { color: theme.colors.text },
        selectedSeason === item.season && [styles.selectedSeasonText, { color: theme.colors.primary }]
      ]}>
        Season {item.season}
      </Text>
      <Text style={[
        styles.seasonSubtext,
        { color: theme.colors.textSecondary },
        selectedSeason === item.season && [styles.selectedSeasonSubtext, { color: theme.colors.text }]
      ]}>
        {item.episodes.length} episodes
      </Text>
    </TouchableOpacity>
  );

  const renderEpisode: ListRenderItem<Episode> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.episodeCard,
        { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
        selectedEpisode === item.id && [styles.selectedEpisodeCard, { backgroundColor: 'rgba(229, 9, 20, 0.1)', borderColor: theme.colors.primary }]
      ]}
      onPress={() => navigateToEpisode(item, selectedSeason)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item.thumbnail || 'https://via.placeholder.com/200x112/333333/ffffff?text=Episode' }} 
        style={styles.episodeThumbnail}
        defaultSource={{ uri: 'https://via.placeholder.com/200x112/333333/ffffff?text=Loading' }}
      />
      <View style={styles.episodeInfo}>
        <View style={styles.episodeHeader}>
          <Text style={[styles.episodeNumber, { color: theme.colors.text }]}>
            Episode {item.episodeNumber}
          </Text>
          <Text style={[styles.episodeDuration, { color: theme.colors.textSecondary }]}>
            {formatDuration(item.duration)}
          </Text>
        </View>
        <Text style={[styles.episodeTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.episodeDescription, { color: theme.colors.textSecondary }]} numberOfLines={3}>
          {item.description}
        </Text>
        <Text style={[styles.episodeAirDate, { color: theme.colors.textMuted }]}>
          Aired: {item.airDate ? new Date(item.airDate).toLocaleDateString() : 'Unknown'}
        </Text>
      </View>
      {selectedEpisode === item.id && (
        <View style={styles.playingIndicator}>
          <Ionicons name="play-circle" size={28} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    if (!seriesInfo) return null;

    switch (activeTab) {
      case 'episodes':
        return (
          <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.seasonSelector}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Seasons</Text>
              <FlatList
                data={seasons}
                renderItem={renderSeason}
                keyExtractor={(item) => item.season?.toString() || 'unknown'}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.seasonList}
                contentContainerStyle={styles.seasonListContent}
              />
            </View>
            
            <View style={styles.episodeSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {currentSeason?.title} ({currentSeason?.year})
              </Text>
              {currentSeason?.description && (
                <Text style={[styles.seasonDescription, { color: theme.colors.textSecondary }]}>
                  {currentSeason.description}
                </Text>
              )}
              <FlatList
                data={currentSeason?.episodes}
                renderItem={renderEpisode}
                keyExtractor={(item) => item.id}
                style={styles.episodeList}
                contentContainerStyle={styles.episodeListContent}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        );

      case 'details':
        return (
          <ScrollView style={[styles.tabContent, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.seriesHeaderSection}>
              <Image source={{ uri: seriesInfo.poster }} style={styles.seriesPoster} />
              <View style={styles.seriesInfoContainer}>
                <Text style={[styles.seriesTitle, { color: theme.colors.text }]}>
                  {seriesInfo.title}
                </Text>
                <View style={styles.seriesMeta}>
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>{seriesInfo.year}</Text>
                  <View style={[styles.metadataDot, { backgroundColor: theme.colors.textSecondary }]} />
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>{seriesInfo.genre}</Text>
                  <View style={[styles.metadataDot, { backgroundColor: theme.colors.textSecondary }]} />
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={theme.colors.primary} />
                    <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                      {seriesInfo.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.totalSeasonsText, { color: theme.colors.textSecondary }]}>
                  {seriesInfo.totalSeasons} Season{seriesInfo.totalSeasons !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            
            {/* Watch Later Button */}
            <View style={styles.actionButtonsContainer}>
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
            
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overview</Text>
            <Text style={[styles.overviewText, { color: theme.colors.textSecondary }]}>
              {seriesInfo.description}
            </Text>
          </ScrollView>
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
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading series...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !seriesInfo) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centeredContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Oops! Something went wrong</Text>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>{error || 'Series not found'}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} onPress={loadSeriesData}>
            <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Video Player */}
      <View style={styles.videoContainer}>
        {shouldUseWebView ? (
          // WebView Video Player
          <>
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
              tmdbId={id || ''}
              type="series"
              season={selectedSeason}
              episode={currentEpisode?.episodeNumber}
              showLoadingOverlay={false}
              onLoadStart={handleVideoLoadStart}
              onLoadEnd={handleVideoLoadEnd}
              onError={handleVideoError}
            />
            
            {/* WebView Controls Overlay */}
            <View style={styles.controlsOverlay}>
              <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.8)']}
                style={styles.controlsGradient}
              />
              
              {/* Top Controls */}
              <View style={styles.topControls}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <Text style={[styles.videoTitle, { color: theme.colors.surface }]} numberOfLines={1}>
                    {currentEpisode?.title || seriesInfo.title}
                  </Text>
                  <Text style={[styles.videoSubtitle, { color: theme.colors.surface }]} numberOfLines={1}>
                    S{selectedSeason} E{currentEpisode?.episodeNumber} • {seriesInfo.title}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.headerActionButton}
                  onPress={handleWatchLater}
                  disabled={watchLaterLoading}
                >
                  {watchLaterLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <Ionicons 
                      name={isInWatchLater ? "bookmark" : "bookmark-outline"} 
                      size={24} 
                      color={isInWatchLater ? theme.colors.primary : theme.colors.surface} 
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.fallbackButton}
                  onPress={() => setUseWebView(!useWebView)}
                >
                  <Ionicons name="tv-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          // Native Video Player
          <TouchableOpacity 
            style={styles.videoPlayerContainer}
            onPress={handleScreenPress}
            activeOpacity={1}
          >
            <VideoView
              style={styles.video}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              contentFit="contain"
              nativeControls={false}
            />

            {/* Native Video Controls Overlay */}
            {showControls && (
              <View style={styles.controlsOverlay}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.controlsGradient}
                />
                
                {/* Top Controls */}
                <View style={styles.topControls}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                  >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.videoTitle, { color: theme.colors.surface }]} numberOfLines={1}>
                      {currentEpisode?.title || seriesInfo.title}
                    </Text>
                    <Text style={[styles.videoSubtitle, { color: theme.colors.surface }]} numberOfLines={1}>
                      S{selectedSeason} E{currentEpisode?.episodeNumber} • {seriesInfo.title}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.headerActionButton}
                    onPress={handleWatchLater}
                    disabled={watchLaterLoading}
                  >
                    {watchLaterLoading ? (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                      <Ionicons 
                        name={isInWatchLater ? "bookmark" : "bookmark-outline"} 
                        size={24} 
                        color={isInWatchLater ? theme.colors.primary : theme.colors.surface} 
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.fallbackButton}
                    onPress={() => setUseWebView(!useWebView)}
                  >
                    <Ionicons name="globe-outline" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Center Controls */}
                <View style={styles.centerControls}>
                  <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={() => {
                      if (player) {
                        player.currentTime = Math.max(0, playerCurrentTime - 10);
                      }
                    }}
                  >
                    <Ionicons name="play-skip-back" size={32} color={theme.colors.surface} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={handlePlayPause}
                  >
                    <Ionicons 
                      name={playerIsPlaying ? "pause" : "play"} 
                      size={40} 
                      color={theme.colors.surface} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={() => {
                      if (player) {
                        player.currentTime = Math.min(playerDuration, playerCurrentTime + 10);
                      }
                    }}
                  >
                    <Ionicons name="play-skip-forward" size={32} color={theme.colors.surface} />
                  </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                      <View 
                        style={[
                          styles.progress, 
                          { 
                            width: `${(playerCurrentTime / playerDuration) * 100}%`,
                            backgroundColor: theme.colors.primary
                          }
                        ]} 
                      />
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={[styles.timeText, { color: theme.colors.surface }]}>
                        {formatTime(playerCurrentTime)}
                      </Text>
                      <Text style={[styles.timeText, { color: theme.colors.surface }]}>
                        {formatTime(playerDuration)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { borderBottomColor: 'transparent' },
            activeTab === 'episodes' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setActiveTab('episodes')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: theme.colors.textSecondary },
            activeTab === 'episodes' && [styles.activeTabText, { color: theme.colors.primary }]
          ]}>
            Episodes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            { borderBottomColor: 'transparent' },
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
  videoContainer: {
    width: width,
    height: width * (9 / 16),
    backgroundColor: '#000000', // Keep this for video player
    position: 'relative',
  },
  videoPlayerContainer: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
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
    marginTop: 12,
    fontSize: 16,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  controlsGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  videoSubtitle: {
    fontSize: 14,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fallbackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  skipButton: {
    padding: 12,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    padding: 20,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#E50914',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  seasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
  },
  selectedSeasonButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  seasonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  seasonSubtext: {
    fontSize: 12,
  },
  selectedSeasonSubtext: {
    color: '#FFFFFF', // This will be overridden by theme
  },
  selectedSeasonText: {
    color: '#E50914', // This will be overridden by theme
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  seasonSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  seasonList: {
    marginBottom: 8,
  },
  seasonListContent: {
    gap: 12,
  },
  episodeSection: {
    flex: 1,
  },
  seasonDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  episodeList: {
    flex: 1,
  },
  episodeListContent: {
    paddingBottom: 20,
  },
  episodeCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedEpisodeCard: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderWidth: 1,
    borderColor: '#E50914',
  },
  episodeThumbnail: {
    width: 120,
    height: 68,
    borderRadius: 8,
    marginRight: 16,
  },
  episodeInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  episodeNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  episodeDuration: {
    fontSize: 12,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  episodeDescription: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 18,
  },
  episodeAirDate: {
    fontSize: 12,
  },
  playingIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  seriesHeaderSection: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  seriesPoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  seriesInfoContainer: {
    flex: 1,
  },
  seriesTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  seriesMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
  },
  metadataDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  totalSeasonsText: {
    fontSize: 14,
  },
  actionButtonsContainer: {
    marginBottom: 24,
  },
  watchLaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  watchLaterButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  overviewText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});