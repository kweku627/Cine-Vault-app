import AsyncStorage from '@react-native-async-storage/async-storage';
import { Content } from '@/types/content';
import { getApiUrl } from './config';

// Define the new API response structure based on the provided JSON
interface ApiMoviesResponse {
  success: boolean;
  popular_count: number;
  page: number;
  results: ApiMovie[];
  trending_count: number;
  total_results: number;
}

// Define the new ApiMovie interface to match the new API structure
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

// Helper to get the auth token
async function getToken(): Promise<string | null> {
  try {
    // For React Native with AsyncStorage
    return await AsyncStorage.getItem('token');
    // For web: return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export class HomeApiService {
  private static async fetchData<T>(endpoint: string): Promise<T> {
    const url = getApiUrl(`external-movies/${endpoint}`);
    console.log('Fetching movie detail/list from:', url);
    
    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      console.log('Making request to:', url);
      const response = await fetch(url, { method: 'GET', headers });
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data received:', data);
      return data;
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }

  // Unified transform function for both list and detail
  private static transformToContent(apiData: any): any {
    const poster = apiData.poster_path?.startsWith('http')
      ? apiData.poster_path
      : `https://image.tmdb.org/t/p/w500${apiData.poster_path || ''}`;
    const backdrop = apiData.poster_path?.startsWith('http')
      ? apiData.poster_path
      : `https://image.tmdb.org/t/p/w1280${apiData.poster_path || ''}`;
    const tmdbId = apiData.id?.toString() || '';
    
    // Extract year from release_date
    let year = '';
    if (apiData.release_date) {
      year = new Date(apiData.release_date).getFullYear().toString();
    } else if (apiData.year) {
      year = apiData.year.toString();
    }
    
    return {
      id: tmdbId,
      title: apiData.title || apiData.name || '',
      poster,
      backdrop,
      voteAverage: apiData.vote_average || 0,
      year: year,
      genre: apiData.genre || (Array.isArray(apiData.genres) ? apiData.genres[0] : ''),
      duration: 120,
      type: apiData.type || 'movie',
      description: apiData.overview || '',
      videoUri: `https://vidsrc.to/embed/movie/${tmdbId}`,
    };
  }

  static async getFeaturedContent(): Promise<any[]> {
    const data = await this.fetchData<any>('popular');
    return Array.isArray(data.results) ? data.results.map(this.transformToContent) : [];
  }

  static async getCategories(): Promise<any[]> {
    const data = await this.fetchData<{ genres: { id: number; name: string }[] }>('genres');
    return data.genres.map(genre => ({ id: genre.id.toString(), name: genre.name, content: [] }));
  }

  static async getAllMovies(): Promise<any[]> {
    const data = await this.fetchData<any>('popular');
    // Return the raw API data so ContentGrid can properly extract year and rating
    return Array.isArray(data.results) ? data.results : [];
  }

  static async getMovieById(id: string | number): Promise<any | null> {
    const data = await this.fetchData<any>(`${id}`);
    console.log('Raw movie detail response:', data);
    
    // Handle the backend response structure: { success: true, movie: {...} }
    if (data.success && data.movie) {
      return this.transformToContent(data.movie);
    } else if (data.success && data.id) {
      // Fallback: if the movie data is directly in the response
      return this.transformToContent(data);
    } else {
      console.error('Invalid movie detail response:', data);
      return null;
    }
  }
}