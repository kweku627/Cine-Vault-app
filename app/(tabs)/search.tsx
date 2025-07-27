import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { HomeApiService } from '@/services/MoviesApiService';
import { SeriesApiService } from '@/services/SeriesApiService';
import { useTheme } from '@/contexts/ThemeContext';
import { Content, SearchFilters } from '@/types/content';
import FilterModal from '@/components/FilterModal';

const { width: screenWidth } = Dimensions.get('window');

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    genre: 'all',
    year: 'all',
  });
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<Content[]>([]);
  const [allSeries, setAllSeries] = useState<Content[]>([]);

  useEffect(() => {
    loadRecentSearches();
    loadAllContent();
  }, []);

  // Apply filters when content is loaded or filters change
  useEffect(() => {
    if (allMovies.length > 0 || allSeries.length > 0) {
      applyFiltersToContent(filters);
    }
  }, [allMovies, allSeries, filters]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setError(null);
    }
  }, [searchQuery, filters]);

  const loadRecentSearches = async () => {
    try {
      // Mock recent searches for now
      setRecentSearches(['Marvel', 'Disney', 'Animation', 'Star Wars', 'Action', 'Drama']);
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const loadAllContent = async () => {
    try {
      console.log('Loading all content for search...');
      
      // Load movies and series from our backend APIs
      const [moviesData, seriesData] = await Promise.all([
        HomeApiService.getAllMovies(),
        SeriesApiService.getAllSeries()
      ]);
      
      console.log('Loaded movies:', moviesData.length);
      console.log('Loaded series:', seriesData.length);
      
      setAllMovies(moviesData);
      setAllSeries(seriesData);
    } catch (error) {
      console.error('Failed to load all content:', error);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    if (query.trim().length === 0) {
      // If no search query, just apply filters to all content
      applyFiltersToContent(filters);
      return;
    }
    
    setIsSearching(true);
    setError(null);
    try {
      console.log('Searching for:', query, 'with filters:', filters);
      
      // Apply filters and search
      applyFiltersToContent(filters);
      
      // Save to recent searches
      if (!recentSearches.includes(query)) {
        const updatedRecent = [query, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedRecent);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please check your connection and try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setError(null);
    // Reset filters to show all content
    const resetFilters: SearchFilters = { type: 'all', genre: 'all', year: 'all' };
    setFilters(resetFilters);
    // Apply the reset filters to show all content
    applyFiltersToContent(resetFilters);
  };

  const applyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
    
    // Apply filters to current content immediately
    applyFiltersToContent(newFilters);
  };

  const applyFiltersToContent = (currentFilters: SearchFilters) => {
    console.log('Applying filters:', currentFilters);
    
    let allContent = [...allMovies, ...allSeries];
    
    // Apply type filter
    if (currentFilters.type !== 'all') {
      allContent = allContent.filter(item => item.type === currentFilters.type);
      console.log('After type filter:', allContent.length);
    }
    
    // Apply genre filter
    if (currentFilters.genre !== 'all') {
      allContent = allContent.filter(item => 
        item.genre.toLowerCase().includes(currentFilters.genre.toLowerCase())
      );
      console.log('After genre filter:', allContent.length);
    }
    
    // Apply year filter
    if (currentFilters.year !== 'all') {
      allContent = allContent.filter(item => 
        item.year.toString() === currentFilters.year
      );
      console.log('After year filter:', allContent.length);
    }
    
    // If there's a search query, apply search filter
    if (searchQuery.trim().length > 0) {
      allContent = allContent.filter(item => {
        const searchTerm = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const genreMatch = item.genre.toLowerCase().includes(searchTerm);
        const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
        
        return titleMatch || genreMatch || descriptionMatch;
      });
      console.log('After search filter:', allContent.length);
    }
    
    setSearchResults(allContent);
  };

  const retrySearch = () => {
    if (searchQuery.trim().length > 0) {
      handleSearch();
    }
  };

  const handleContentPress = (content: Content) => {
    console.log('Navigating to content:', content.title, 'with id:', content.id);
    
    if (content.type === 'series') {
      router.push({
        pathname: `/watch-series/${content.id}`,
        params: {
          title: content.title,
          year: content.year.toString(),
          genre: content.genre,
          description: content.description,
          poster: content.poster,
          backdrop: content.backdrop,
          rating: content.rating.toString(),
          duration: content.duration.toString()
        }
      });
    } else {
      router.push({
        pathname: `/watch/${content.id}`,
        params: {
          title: content.title,
          year: content.year.toString(),
          genre: content.genre,
          description: content.description,
          poster: content.poster,
          backdrop: content.backdrop,
          rating: content.rating.toString(),
          duration: content.duration.toString()
        }
      });
    }
  };

  const renderContentItem = ({ item }: { item: Content }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.contentItem}
      onPress={() => handleContentPress(item)}
    >
      <Image
        source={
          item.poster && item.poster.trim() !== ""
            ? { uri: item.poster }
            : require('@/assets/images/default-poster.png')
        }
        style={styles.contentImage}
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.contentGradient} />
      <View style={styles.contentInfo}>
        <Text style={[styles.contentTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.contentRating, { color: theme.colors.accent }]}>⭐ {item.rating}</Text>
        <Text style={[styles.contentYear, { color: theme.colors.textSecondary }]}>{item.year}</Text>
        <Text style={[styles.contentType, { color: theme.colors.textSecondary }]}>
          {item.type === 'series' ? 'Series' : 'Movie'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies, shows, and more..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.trim().length > 0) {
                handleSearch(text);
              } else {
                // If search is cleared, show filtered content
                applyFiltersToContent(filters);
              }
            }}
            onSubmitEditing={() => handleSearch()}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { 
              backgroundColor: theme.colors.card,
              borderWidth: (filters.type !== 'all' || filters.genre !== 'all' || filters.year !== 'all') ? 2 : 0,
              borderColor: theme.colors.primary
            }
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons 
            name="filter" 
            size={20} 
            color={(filters.type !== 'all' || filters.genre !== 'all' || filters.year !== 'all') ? theme.colors.primary : theme.colors.textMuted} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isSearching && searchQuery.length === 0 && (
          <>
            {/* Show filtered content when no search is active */}
            {(filters.type !== 'all' || filters.genre !== 'all' || filters.year !== 'all') && searchResults.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {filters.type !== 'all' ? `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}s` : 'Content'}
                  {(filters.genre !== 'all' || filters.year !== 'all') && ' - Filtered'}
                </Text>
                
                {/* Filter Summary */}
                <View style={styles.filterSummary}>
                  <Text style={[styles.filterSummaryText, { color: theme.colors.textSecondary }]}>
                    Filters: 
                    {filters.type !== 'all' && ` ${filters.type}`}
                    {filters.genre !== 'all' && ` • ${filters.genre}`}
                    {filters.year !== 'all' && ` • ${filters.year}`}
                  </Text>
                  <TouchableOpacity onPress={() => applyFilters({ type: 'all', genre: 'all', year: 'all' })}>
                    <Text style={[styles.clearFiltersText, { color: theme.colors.primary }]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={searchResults}
                  renderItem={renderContentItem}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.recentSearches}>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentSearchItem}
                      onPress={() => handleRecentSearch(search)}
                    >
                      <Ionicons name="search" size={16} color={theme.colors.textMuted} />
                      <Text style={styles.recentSearchText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Show all content when no filters are active */}
            {(filters.type === 'all' && filters.genre === 'all' && filters.year === 'all') && searchResults.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Browse All Content</Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderContentItem}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular</Text>
              <View style={styles.popularTags}>
                {['Action', 'Drama', 'Comedy', 'Romance', 'Thriller', 'Sci-Fi'].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.popularTag, { backgroundColor: theme.colors.card }]}
                    onPress={() => handleRecentSearch(tag)}
                  >
                    <Text style={styles.popularTagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {searchQuery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
            </Text>
            
            {/* Filter Summary */}
            {(filters.type !== 'all' || filters.genre !== 'all' || filters.year !== 'all') && (
              <View style={styles.filterSummary}>
                <Text style={[styles.filterSummaryText, { color: theme.colors.textSecondary }]}>
                  Filters: 
                  {filters.type !== 'all' && ` ${filters.type}`}
                  {filters.genre !== 'all' && ` • ${filters.genre}`}
                  {filters.year !== 'all' && ` • ${filters.year}`}
                </Text>
                <TouchableOpacity onPress={() => applyFilters({ type: 'all', genre: 'all', year: 'all' })}>
                  <Text style={[styles.clearFiltersText, { color: theme.colors.primary }]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                  Searching for content...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
                <Text style={[styles.errorText, { color: theme.colors.text }]}>
                  {error}
                </Text>
                <TouchableOpacity 
                  style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                  onPress={retrySearch}
                >
                  <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderContentItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noResults}>No results found</Text>
            )}
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={showFilters}
        filters={filters}
        onApply={applyFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  filterButton: {
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  recentSearches: {
    gap: 12,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  recentSearchText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  popularTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  popularTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noResults: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
  contentItem: {
    width: (screenWidth - 60) / 3,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    marginBottom: 15,
    position: 'relative',
  },
  contentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
  },
  contentInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  contentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contentRating: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: '600',
  },
  contentYear: {
    fontSize: 10,
    marginBottom: 2,
  },
  contentType: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  filterSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  filterSummaryText: {
    fontSize: 14,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
  },
});