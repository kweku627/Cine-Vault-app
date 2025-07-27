import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRatings } from '@/contexts/RatingsContext';
import ContentCard from '@/components/ContentCard';

export default function RatedContentScreen() {
  const { theme } = useTheme();
  const { ratedItems } = useRatings();

  const handleContentPress = (item: any) => {
    // Navigate to content detail based on type
    if (item.type === 'movie') {
      // Navigate to movie detail
      console.log('Navigate to movie:', item.id);
    } else if (item.type === 'series') {
      // Navigate to series detail
      console.log('Navigate to series:', item.id);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <ContentCard
      id={item.id}
      title={item.title}
      poster={item.poster}
      year={item.year.toString()}
      type={item.type}
      rating={item.rating}
      onPress={() => handleContentPress(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Rated Content</Text>
      
      {ratedItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            You haven't rated any content yet.
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>
            Rate movies and series to see them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={ratedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
}); 