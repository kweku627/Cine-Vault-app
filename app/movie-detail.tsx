import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useWatchLater } from '@/contexts/WatchLaterContext';
import { useLikes } from '@/contexts/LikesContext';
import { useRatings } from '@/contexts/RatingsContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { theme } = useTheme();
  const { id, title, year, type, poster, rating, stars, description } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();
  const { toggleLike, isLiked, getLikesCount } = useLikes();
  const { setRating, getUserRating, getAverageRating, getTotalRatings } = useRatings();
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleWatchNow = () => {
    if (type === 'series') {
      router.push(`/watch-series/${id}`);
    } else {
      router.push(`/watch/${id}`);
    }
  };

  const handleLike = () => {
    toggleLike(id as string, type as 'movie' | 'series');
  };

  const handleWatchLater = () => {
    const movieData = {
      id: id as string,
      title: title as string,
      poster: poster as string,
      year: Number(year),
      type: type as 'movie' | 'series',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isSaved: true,
      description: description as string,
      backdrop: "",
      genre: "",
      duration: 0,
      rating: 0,
      videoUri: "",
    };
    
    if (isInWatchLater(id as string)) {
      removeFromWatchLater(id as string);
    } else {
      addToWatchLater(movieData);
    }
  };

  const handleRating = (rating: number) => {
    setRating(id as string, type as 'movie' | 'series', rating);
    setShowRatingModal(false);
  };

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <TouchableOpacity
        key={i}
        onPress={interactive ? () => handleRating(i + 1) : undefined}
        disabled={!interactive}
      >
        <Ionicons
          name={i < rating ? "star" : "star-outline"}
          size={size}
          color={i < rating ? "#FFD700" : "#666"}
          style={{ marginRight: 2 }}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image source={{ uri: poster as string }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{title}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.year}>{year}</Text>
              <Text style={styles.contentRating}>{rating}</Text>
              <Text style={styles.duration}>2h 15m</Text>
            </View>
            <Text style={styles.heroDescription}>{description}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.watchButton} onPress={handleWatchNow}>
          <Ionicons name="play" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.watchButtonText}>Watch Now</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleWatchLater}>
            <Ionicons 
              name={isInWatchLater(id as string) ? "checkmark" : "add"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons 
              name={isLiked(id as string) ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked(id as string) ? "#E50914" : "#fff"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowRatingModal(true)}>
            <Ionicons name="star-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ratings Section */}
      <View style={styles.ratingsSection}>
        <Text style={styles.sectionTitle}>Ratings</Text>
        <View style={styles.ratingRow}>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Your Rating</Text>
            <View style={styles.starsContainer}>
              {renderStars(getUserRating(id as string), 20, true)}
            </View>
            <Text style={styles.ratingText}>{getUserRating(id as string) || 'Not rated'}</Text>
          </View>
          
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Average Rating</Text>
            <View style={styles.starsContainer}>
              {renderStars(Math.round(getAverageRating(id as string)), 20)}
            </View>
            <Text style={styles.ratingText}>
              {getAverageRating(id as string).toFixed(1)} ({getTotalRatings(id as string)} ratings)
            </Text>
          </View>
        </View>
      </View>

      {/* Likes Section */}
      <View style={styles.likesSection}>
        <Text style={styles.sectionTitle}>Likes</Text>
        <View style={styles.likesInfo}>
          <Ionicons 
            name={isLiked(id as string) ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked(id as string) ? "#E50914" : "#666"} 
          />
          <Text style={styles.likesText}>
            {getLikesCount(id as string)} people liked this {type}
          </Text>
        </View>
      </View>

      {/* Rating Modal */}
      {showRatingModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.ratingModal}>
            <Text style={styles.modalTitle}>Rate this {type}</Text>
            <View style={styles.modalStars}>
              {renderStars(0, 32, true)}
            </View>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowRatingModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.6,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
    padding: 24,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  year: {
    fontSize: 16,
    color: '#fff',
  },
  contentRating: {
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  duration: {
    fontSize: 16,
    color: '#fff',
  },
  heroDescription: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  actionSection: {
    padding: 24,
    gap: 16,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 16,
    borderRadius: 8,
  },
  watchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingsSection: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 32,
  },
  ratingItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  likesSection: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  likesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  likesText: {
    fontSize: 16,
    color: '#fff',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingModal: {
    backgroundColor: '#1a1a1a',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  modalStars: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E50914',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 