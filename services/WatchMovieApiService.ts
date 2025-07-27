import { getApiUrl } from './config';

// Define the movie info interface for the watch screen
export interface MovieInfo {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  year: number;
  rating: number;
  genre: string;
  duration: number;
  videoUri: string;
}

// Define the new API movie interface to match the provided JSON structure
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

export class WatchMovieApiService {
  private static async fetchData<T>(endpoint: string): Promise<T> {
    const url = getApiUrl(`external-movies/${endpoint}`);
    console.log('Fetching movie data from:', url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch movie data:', error);
      throw error;
    }
  }

  static async getMovieDetails(movieId: string): Promise<MovieInfo> {
    try {
      const data = await this.fetchData<any>(`${movieId}`);
      
      console.log('Raw movie data received:', JSON.stringify(data));
      
      // Handle the nested structure where movie data is under 'movie' property
      const movieData = data.movie || data;
      
      if (!movieData) {
        console.error('No movie data found in response');
        throw new Error('No movie data found');
      }
      
      // Transform the API data to match the frontend structure
      const movieInfo: MovieInfo = {
        id: movieData.id?.toString() || movieId,
        title: movieData.title || 'Unknown Movie',
        description: movieData.overview || 'No description available',
        poster: movieData.poster_path?.startsWith('http') ? movieData.poster_path : `https://image.tmdb.org/t/p/w500${movieData.poster_path || ''}`,
        backdrop: movieData.poster_path?.startsWith('http') ? movieData.poster_path : `https://image.tmdb.org/t/p/w1280${movieData.poster_path || ''}`,
        year: movieData.release_date ? new Date(movieData.release_date).getFullYear() : new Date().getFullYear(),
        rating: movieData.vote_average || 0,
        genre: movieData.genre || 'Unknown',
        duration: 120, // Default 2 hours
        videoUri: movieData.video_link || `https://vidsrc.to/embed/movie/${movieData.id || movieId}`,
      };

      console.log('Transformed movie info:', movieInfo);
      return movieInfo;
    } catch (error) {
      console.error('Error in getMovieDetails:', error);
      throw error;
    }
  }
} 