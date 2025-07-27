import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './config';

// Define the API response structure for video scraping
interface VideoScraperResponse {
  success: boolean;
  movieId: string;
  videoUrl: string;
  method: string;
  message: string;
}

interface VideoScraperErrorResponse {
  success: false;
  error: string;
  timestamp: number;
}

// Helper to get the auth token
async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export class VideoScraperService {
  /**
   * Get video URL for a movie by its ID
   * @param movieId - The movie ID to get video for
   * @returns Promise with video URL or throws error
   */
  static async getMovieVideoUrl(movieId: string): Promise<string> {
    const url = getApiUrl(`scrape/video/${movieId}`);
    console.log('Fetching video URL from:', url);
    
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
      
      const data: VideoScraperResponse | VideoScraperErrorResponse = await response.json();
      console.log('Video scraper response:', data);
      
      if (data.success) {
        return data.videoUrl;
      } else {
        const errorData = data as VideoScraperErrorResponse;
        throw new Error(errorData.error || 'Failed to get video URL');
      }
    } catch (error) {
      console.error('Video scraper error:', error);
      throw error;
    }
  }

  /**
   * Check if a movie has available video
   * @param movieId - The movie ID to check
   * @returns Promise with boolean indicating availability
   */
  static async checkVideoAvailability(movieId: string): Promise<boolean> {
    try {
      await this.getMovieVideoUrl(movieId);
      return true;
    } catch (error) {
      console.log('Video not available for movie:', movieId, error);
      return false;
    }
  }

  /**
   * Get video URL with fallback to embed URL
   * @param movieId - The movie ID
   * @returns Promise with video URL (either direct or embed)
   */
  static async getMovieVideoUrlWithFallback(movieId: string): Promise<string> {
    try {
      // Try to get the scraped video URL first
      return await this.getMovieVideoUrl(movieId);
    } catch (error) {
      console.log('Falling back to embed URL for movie:', movieId);
      // Fallback to embed URL
      return `https://vidsrc.to/embed/movie/${movieId}`;
    }
  }
} 