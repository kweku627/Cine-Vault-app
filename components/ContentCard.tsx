import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useWatchLater } from '@/contexts/WatchLaterContext';
import { useLikes } from '@/contexts/LikesContext';
import { useRatings } from '@/contexts/RatingsContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface ContentCardProps {
  id: string;
  title: string;
  poster: string;
  year: string;
  type: 'movie' | 'series';
  rating?: number;
  onPress?: () => void;
  numColumns?: number;
}

export default function ContentCard({ 
  id, 
  title, 
  poster, 
  year, 
  type, 
  rating = 0, 
  onPress,
  numColumns = 3
}: ContentCardProps) {
  const { theme } = useTheme();
  const { addToWatchLater, removeFromWatchLater } = useWatchLater();
  const { toggleLike, isLiked } = useLikes();
  const { setRating, getUserRating } = useRatings();
  const [showActions, setShowActions] = useState(false);

  // Calculate card width based on number of columns
  const getCardWidth = () => {
    const containerPadding = 40; // 20px on each side
    const gapBetweenCards = 16; // 16px gap between cards
    const availableWidth = width - containerPadding;
    
    if (numColumns === 3) {
      return (availableWidth - gapBetweenCards * 2) / 3;
    } else if (numColumns === 2) {
      return (availableWidth - gapBetweenCards) / 2;
    }
    return (availableWidth - gapBetweenCards * 2) / 3; // default to 3 columns
  };

  const cardWidth = getCardWidth();
  const cardHeight = cardWidth * 1.5; // Maintain aspect ratio

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/movie-detail?id=${id}&title=${title}&year=${year}&type=${type}&poster=${poster}`);
    }
  };

  const handleLike = (e: any) => {
    e.stopPropagation();
    toggleLike(id, type);
  };

  const handleWatchLater = (e: any) => {
    e.stopPropagation();
    const movieData = {
      id,
      title,
      description: '',
      poster,
      year: parseInt(year) || 2024,
      type,
      genre: '',
      duration: 0,
      rating: rating,
      videoUri: '',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: isLiked(id),
      isSaved: isInWatchLater(),
    };
    
    if (isInWatchLater()) {
      removeFromWatchLater(id);
    } else {
      addToWatchLater(movieData);
    }
  };

  const handleRating = (e: any, ratingValue: number) => {
    e.stopPropagation();
    setRating(id, type, ratingValue);
  };

  const isInWatchLater = () => {
    // Check if the current item is in the watch later list
    const watchLaterList = useWatchLater().watchLaterList;
    return watchLaterList.some(item => item.id === id);
  };

  const renderStars = (rating: number, size: number = 12) => {
    // Convert rating from 10-point scale to 5-point scale
    const ratingOutOf5 = Math.round((rating / 10) * 5);
    console.log('ContentCard renderStars - rating:', rating, 'converted to:', ratingOutOf5);
    
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < ratingOutOf5 ? "star" : "star-outline"}
        size={size}
        color={i < ratingOutOf5 ? theme.colors.accent : theme.colors.textMuted}
        style={{ marginRight: 1 }}
      />
    ));
  };

  const styles = createStyles(theme, cardWidth, cardHeight, numColumns);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      onLongPress={() => setShowActions(true)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: poster }} style={styles.image} />
        
        {/* Overlay with actions */}
        {showActions && (
          <View style={styles.overlay}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Ionicons 
                  name={isLiked(id) ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isLiked(id) ? theme.colors.error : theme.colors.surface} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleWatchLater}>
                <Ionicons 
                  name={isInWatchLater() ? "checkmark" : "add"} 
                  size={20} 
                  color={theme.colors.surface} 
                />
              </TouchableOpacity>
              
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity 
                    key={star} 
                    style={styles.starButton}
                    onPress={(e) => handleRating(e, star)}
                  >
                    <Ionicons
                      name={star <= getUserRating(id) ? "star" : "star-outline"}
                      size={16}
                      color={star <= getUserRating(id) ? theme.colors.accent : theme.colors.surface}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowActions(false)}
            >
              <Ionicons name="close" size={20} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Quick like indicator */}
        {isLiked(id) && !showActions && (
          <View style={styles.likeIndicator}>
            <Ionicons name="heart" size={16} color={theme.colors.error} />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
        <View style={styles.meta}>
          <Text style={styles.year}>{year}</Text>
          {rating > 0 && (
            <View style={styles.rating}>
              {renderStars(rating)}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any, cardWidth: number, cardHeight: number, numColumns: number) => StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: cardHeight,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    paddingHorizontal: 4,
    minHeight: numColumns === 3 ? 50 : 60,
  },
  title: {
    fontSize: numColumns === 3 ? 12 : 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: numColumns === 3 ? 16 : 18,
    height: numColumns === 3 ? 32 : 36,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  year: {
    fontSize: numColumns === 3 ? 10 : 12,
    color: theme.colors.textMuted,
  },
  rating: {
    flexDirection: 'row',
  },
  match: {
    fontSize: numColumns === 3 ? 10 : 12,
    color: theme.colors.accent,
    fontWeight: '500',
  },
}); 