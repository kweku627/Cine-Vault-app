import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import ContentCard from './ContentCard';

const { width } = Dimensions.get('window');

interface ContentGridProps {
  content: any[];
  numColumns?: number;
  onContentPress?: (item: any) => void;
}

export default function ContentGrid({ content, numColumns = 3, onContentPress }: ContentGridProps) {
  const { theme } = useTheme();

  const handleContentPress = (item: any) => {
    if (onContentPress) {
      onContentPress(item);
    } else {
      // Navigate to movie-detail screen with all necessary params
      const params = {
        id: item.id?.toString() || '',
        type: item.type || 'movie',
        title: item.title || 'Unknown Title',
        year: item.year?.toString() || '',
        rating: item.contentRating || 'PG-13',
        stars: item.rating?.toString() || item.voteAverage?.toString() || '5',
        description: item.description || item.overview || 'No description available.',
        poster: item.poster || '',
      };
      
      // Use the ContentCard's navigation logic
      return params;
    }
  };

  const styles = createStyles(theme, numColumns);

  const renderItem = ({ item }: { item: any }) => {
    // Debug logging
    console.log('ContentGrid renderItem - item:', {
      id: item.id,
      title: item.title || item.name,
      vote_average: item.vote_average,
      rating: item.rating,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      poster_path: item.poster_path
    });

    // Extract year from release_date or first_air_date
    let year = '';
    if (item.release_date) {
      year = new Date(item.release_date).getFullYear().toString();
    } else if (item.first_air_date) {
      year = new Date(item.first_air_date).getFullYear().toString();
    } else if (item.year) {
      year = item.year.toString();
    }

    // Extract rating from vote_average (this is the key fix)
    const rating = item.vote_average || item.rating || 0;
    console.log('ContentGrid - extracted rating:', rating, 'from vote_average:', item.vote_average);

    // Extract poster from poster_path
    const poster = item.poster_path?.startsWith('http') 
      ? item.poster_path 
      : item.poster || `https://image.tmdb.org/t/p/w500${item.poster_path || ''}`;

    return (
      <ContentCard
        id={item.id?.toString() || ''}
        title={item.title || item.name || 'Unknown Title'}
        poster={poster}
        year={year}
        type={item.type || 'movie'}
        rating={rating}
        onPress={onContentPress ? () => onContentPress(item) : undefined}
        numColumns={numColumns}
      />
    );
  };

  return (
    <FlatList
      data={content}
      renderItem={renderItem}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      numColumns={numColumns}
      {...(numColumns > 1 ? { columnWrapperStyle: styles.row } : {})}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const createStyles = (theme: any, numColumns: number) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 0,
    gap: 16, // Add gap between cards in the same row
  },
});