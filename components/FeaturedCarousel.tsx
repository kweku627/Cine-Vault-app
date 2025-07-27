import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { watchLaterApiService } from '@/services/WatchLaterApiService';

const { width } = Dimensions.get('window');

interface FeaturedCarouselProps {
  content: any[];
  height?: number;
  showControls?: boolean;
  onContentPress?: (item: any) => void;
}

export default function FeaturedCarousel({ 
  content, 
  height = 400, 
  showControls = true,
  onContentPress
}: FeaturedCarouselProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchLaterLoading, setWatchLaterLoading] = useState<{ [key: string]: boolean }>({});
  const [watchLaterStatus, setWatchLaterStatus] = useState<{ [key: string]: boolean }>({});
  const scrollViewRef = useRef<ScrollView>(null);

  // Debug content for duplicate IDs and check watch later status
  useEffect(() => {
    content.forEach((item, index) => {
      if (!item.id) {
        console.warn(`Item at index ${index} is missing an ID`);
      }
    });

    // Check watch later status for all items
    const checkWatchLaterStatus = async () => {
      const statusUpdates: { [key: string]: boolean } = {};
      
      for (const item of content) {
        if (item.id) {
          try {
            const isInWatchLater = await watchLaterApiService.checkIfInWatchLater(item.id.toString());
            statusUpdates[item.id.toString()] = isInWatchLater;
          } catch (error) {
            console.error(`Error checking watch later status for item ${item.id}:`, error);
            statusUpdates[item.id.toString()] = false;
          }
        }
      }
      
      setWatchLaterStatus(prev => ({ ...prev, ...statusUpdates }));
    };

    if (content.length > 0) {
      checkWatchLaterStatus();
    }
  }, [content]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleContentPress = (item: any) => {
    if (onContentPress) {
      onContentPress(item);
    }
  };

  const handleWatchLater = async (item: any) => {
    if (!item.id) {
      Alert.alert('Error', 'Cannot save item without ID');
      return;
    }

    const itemId = item.id.toString();
    setWatchLaterLoading(prev => ({ ...prev, [itemId]: true }));

    try {
      const isInWatchLater = watchLaterStatus[itemId];
      
      if (isInWatchLater) {
        // Remove from watch later
        await watchLaterApiService.removeFromWatchLater(itemId);
        setWatchLaterStatus(prev => ({ ...prev, [itemId]: false }));
      } else {
        // Add to watch later
        const watchLaterItem = {
          contentId: itemId,
          title: item.title,
          type: 'movie' as const,
          poster: item.poster,
          year: item.year,
          genre: item.genre,
          description: item.description || 'No description available'
        } as const;
        
        await watchLaterApiService.addToWatchLater(watchLaterItem);
        setWatchLaterStatus(prev => ({ ...prev, [itemId]: true }));
      }
    } catch (error) {
      console.error('Error handling watch later:', error);
      Alert.alert('Error', 'Failed to update watch later list');
    } finally {
      setWatchLaterLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const createStyles = (theme: any) => StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
    },
    slide: {
      width,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    slideGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      zIndex: 1,
    },
    slideContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      justifyContent: 'flex-end',
      padding: 20,
      paddingTop: 60, // push content lower
      paddingBottom: 20, // less bottom padding
    },
    slideTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    slideDescription: {
      fontSize: 13,
      color: '#F0F0F0',
      lineHeight: 17,
      marginBottom: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      maxWidth: '60%',
    },
    slideMetadata: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 20,
    },
    slideYear: {
      fontSize: 14,
      color: '#E0E0E0',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    slideDot: {
      fontSize: 14,
      color: '#E0E0E0',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    slideGenre: {
      fontSize: 14,
      color: '#E0E0E0',
      textTransform: 'capitalize',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    slideRating: {
      fontSize: 14,
      color: '#FFD700',
      fontWeight: '600',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    playOverlay: {
      position: 'absolute',
      bottom: 80,
      left: 20,
      zIndex: 3,
    },
    playButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    playButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    myListButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: 'rgba(51, 51, 51, 0.8)',
    },
    myListButtonActive: {
      backgroundColor: 'rgba(229, 9, 20, 0.8)',
    },
    myListButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: [{ translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    navButtonLeft: {
      left: 20,
    },
    navButtonRight: {
      right: 20,
    },
    pagination: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    paginationDot: {
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    paginationDotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
    contentIndicator: {
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    indicatorText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '600',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
  });

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ width: width * content.length }}
      >
        {content.map((item, index) => {
          // Extract data from API structure
          const poster = item.poster_path?.startsWith('http') 
            ? item.poster_path 
            : item.poster || `https://image.tmdb.org/t/p/w500${item.poster_path || ''}`;
          
          const backdrop = item.poster_path?.startsWith('http') 
            ? item.poster_path 
            : item.backdrop || `https://image.tmdb.org/t/p/w1280${item.poster_path || ''}`;
          
          const title = item.title || item.name || 'Unknown Title';
          const description = item.description || item.overview || 'No description available';
          const year = item.release_date 
            ? new Date(item.release_date).getFullYear().toString()
            : item.first_air_date 
            ? new Date(item.first_air_date).getFullYear().toString()
            : item.year?.toString() || '';
          const genre = item.genre || 'Unknown';
          const rating = item.vote_average || item.rating || 0;

          console.log('FeaturedCarousel - item data:', {
            id: item.id,
            title,
            poster,
            backdrop,
            year,
            genre,
            rating,
            vote_average: item.vote_average
          });

          return (
            <TouchableOpacity
              key={item.id || `item-${index}`} // Fallback key if item.id is missing
              style={[styles.slide, { width }]}
              onPress={() => handleContentPress(item)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: backdrop }}
                style={styles.image}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                style={styles.slideGradient}
              />
              <View style={styles.slideContent}>
                <Text style={styles.slideTitle} numberOfLines={2}>
                  {title}
                </Text>
                <Text style={styles.slideDescription} numberOfLines={3}>
                  {description}
                </Text>
                <View style={styles.slideMetadata}>
                  <Text style={styles.slideYear}>{year}</Text>
                  <Text style={styles.slideDot}>•</Text>
                  <Text style={styles.slideGenre}>{genre}</Text>
                  <Text style={styles.slideDot}>•</Text>
                  <Text style={styles.slideRating}>⭐ {rating.toFixed(1)}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.playButton} onPress={() => handleContentPress(item)}>
                    <Ionicons name="play" size={20} color="#FFFFFF" />
                    <Text style={styles.playButtonText}>Watch Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.myListButton,
                      watchLaterStatus[item.id] && styles.myListButtonActive
                    ]}
                    onPress={() => handleWatchLater(item)}
                    disabled={watchLaterLoading[item.id]}
                  >
                    {watchLaterLoading[item.id] ? (
                      <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
                    ) : (
                      <Ionicons 
                        name={watchLaterStatus[item.id] ? "checkmark" : "bookmark-outline"} 
                        size={20} 
                        color="#FFFFFF" 
                      />
                    )}
                    <Text style={styles.myListButtonText}>
                      {watchLaterStatus[item.id] ? "Saved" : "Save Later"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {showControls && content.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonLeft]}
            onPress={() => scrollToIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentIndex === 0 ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonRight]}
            onPress={() => scrollToIndex(Math.min(content.length - 1, currentIndex + 1))}
            disabled={currentIndex === content.length - 1}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentIndex === content.length - 1 ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF'} 
            />
          </TouchableOpacity>
          <View style={styles.pagination}>
            {content.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive
                ]}
                onPress={() => scrollToIndex(index)}
              />
            ))}
          </View>
          <View style={styles.contentIndicator}>
            <Text style={styles.indicatorText}>
              {currentIndex + 1} of {content.length}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}