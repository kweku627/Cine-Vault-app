import { Content, Category, Download, UserProfile, SearchFilters } from '@/types/content';

// Define the new API response structures
interface ApiMoviesResponse {
  success: boolean;
  popular_count: number;
  page: number;
  results: ApiMovie[];
  trending_count: number;
  total_results: number;
}

interface ApiSeriesResponse {
  success: boolean;
  popular_count: number;
  page: number;
  results: ApiSeries[];
  trending_count: number;
  total_results: number;
}

// Define the new API interfaces
interface ApiMovie {
  id: number;
  title: string;
  overview: string;
  genre: string;
  poster_path: string;
  video_link: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface ApiSeries {
  id: number;
  name: string;
  overview: string;
  status: string;
  type: string;
  genres: string[];
  networks: string[];
  poster_path: string;
  video_link: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
}

export class ContentService {
  private static baseUrl = 'https://api.themoviedb.org/3';

  private static async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }

  // Transform API movie to Content format
  private static transformApiMovieToContent(apiMovie: ApiMovie): Content {
    return {
      id: apiMovie.id.toString(),
      title: apiMovie.title,
      description: apiMovie.overview || 'No description available',
      poster: `https://image.tmdb.org/t/p/w500${apiMovie.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/w1280${apiMovie.poster_path}`,
      year: new Date(apiMovie.release_date).getFullYear(),
      type: 'movie' as const,
      genre: apiMovie.genre || 'Unknown',
      duration: 120, // Default 2 hours since API doesn't provide duration
      rating: apiMovie.vote_average || 0,
    };
  }

  // Transform API series to Content format
  private static transformApiSeriesToContent(apiSeries: ApiSeries): Content {
    return {
      id: apiSeries.id.toString(),
      title: apiSeries.name,
      description: apiSeries.overview || 'No description available',
      poster: `https://image.tmdb.org/t/p/w500${apiSeries.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/w1280${apiSeries.poster_path}`,
      year: new Date(apiSeries.first_air_date).getFullYear(),
      type: 'series' as const,
      genre: apiSeries.genres[0] || 'Unknown',
      duration: 45, // Default 45 minutes for series episodes
      rating: apiSeries.vote_average || 0,
    };
  }

  static async getFeaturedContent(): Promise<Content[]> {
    try {
      const [moviesData, seriesData] = await Promise.all([
        this.fetchData<ApiMoviesResponse>('/movie/popular?api_key=a0a06ec6441660e15436c849e23b899a'),
        this.fetchData<ApiSeriesResponse>('/tv/popular?api_key=a0a06ec6441660e15436c849e23b899a')
      ]);

      const movies = moviesData.results.slice(0, 3).map(movie => this.transformApiMovieToContent(movie));
      const series = seriesData.results.slice(0, 3).map(series => this.transformApiSeriesToContent(series));

      return [...movies, ...series];
    } catch (error) {
      console.error('Failed to fetch featured content:', error);
      return [];
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const [movieGenres, seriesGenres] = await Promise.all([
        this.fetchData<{ genres: { id: number; name: string }[] }>('/genre/movie/list?api_key=a0a06ec6441660e15436c849e23b899a'),
        this.fetchData<{ genres: { id: number; name: string }[] }>('/genre/tv/list?api_key=a0a06ec6441660e15436c849e23b899a')
      ]);

      const allGenres = [...movieGenres.genres, ...seriesGenres.genres];
      const uniqueGenres = allGenres.filter((genre, index, self) => 
        index === self.findIndex(g => g.name === genre.name)
      );

      return uniqueGenres.map(genre => ({
        id: genre.id.toString(),
        name: genre.name,
        content: []
      }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  static async getContentById(id: string): Promise<Content | undefined> {
    try {
      // Try to fetch as movie first
      try {
        const movieData = await this.fetchData<ApiMovie>(`/movie/${id}?api_key=a0a06ec6441660e15436c849e23b899a`);
        return this.transformApiMovieToContent(movieData);
      } catch {
        // If not found as movie, try as series
        const seriesData = await this.fetchData<ApiSeries>(`/tv/${id}?api_key=a0a06ec6441660e15436c849e23b899a`);
        return this.transformApiSeriesToContent(seriesData);
      }
    } catch (error) {
      console.error('Failed to fetch content by ID:', error);
      return undefined;
    }
  }

  static async searchContent(query: string, filters: SearchFilters = { type: 'all', genre: 'all', year: 'all' }): Promise<Content[]> {
    try {
      const searchPromises = [];

      // Search movies if type is 'all' or 'movie'
      if (filters.type === 'all' || filters.type === 'movie') {
        searchPromises.push(
          this.fetchData<ApiMoviesResponse>(`/search/movie?query=${encodeURIComponent(query)}&api_key=a0a06ec6441660e15436c849e23b899a`)
        );
      }

      // Search series if type is 'all' or 'series'
      if (filters.type === 'all' || filters.type === 'series') {
        searchPromises.push(
          this.fetchData<ApiSeriesResponse>(`/search/tv?query=${encodeURIComponent(query)}&api_key=a0a06ec6441660e15436c849e23b899a`)
        );
      }

      const results = await Promise.all(searchPromises);
      let allContent: Content[] = [];

      // Process movie results
      if (results[0] && 'results' in results[0]) {
        const movies = (results[0] as ApiMoviesResponse).results.map(movie => this.transformApiMovieToContent(movie));
        allContent.push(...movies);
      }

      // Process series results
      if (results[1] && 'results' in results[1]) {
        const series = (results[1] as ApiSeriesResponse).results.map(series => this.transformApiSeriesToContent(series));
        allContent.push(...series);
      }

      // Apply filters
      if (filters.genre && filters.genre !== 'all') {
        allContent = allContent.filter(c => c.genre.toLowerCase() === filters.genre.toLowerCase());
      }

      if (filters.year && filters.year !== 'all') {
        allContent = allContent.filter(c => c.year.toString() === filters.year);
      }

      return allContent;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  static async getRecentSearches(): Promise<string[]> {
    try {
      // In a real app, this would be stored in AsyncStorage or a backend
      return ['Marvel', 'Disney', 'Animation', 'Star Wars', 'Action', 'Drama'];
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      return [];
    }
  }

  static async saveRecentSearch(query: string): Promise<void> {
    try {
      // In a real app, save to AsyncStorage or backend
      console.log('Saved recent search:', query);
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  }

  static async getDownloads(): Promise<Download[]> {
    // Mock downloads for now
    return [];
  }

  static async deleteDownload(id: string): Promise<void> {
    // Mock delete for now
    console.log('Deleted download:', id);
  }

  static async deleteAllDownloads(): Promise<void> {
    // Mock delete all for now
    console.log('Deleted all downloads');
  }

  static async getUserProfile(): Promise<UserProfile> {
    // Mock user profile for now
    return {
      id: '1',
      name: 'Movie Fan',
      email: 'fan@example.com',
      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      watchedCount: 42,
      watchlistCount: 18,
      downloadsCount: 0,
    };
  }
}