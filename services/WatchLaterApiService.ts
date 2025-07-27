import { API_CONFIG } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatchLaterItem {
  id: number;
  contentId: string;
  title: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  year?: string;
  genre?: string;
  type: 'movie' | 'series';
  duration?: string;
  rating?: string;
  createdAt: string;
}

export interface WatchLaterRequest {
  contentId: string;
  title: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  year?: string;
  genre?: string;
  type: 'movie' | 'series';
  duration?: string;
  rating?: string;
}

class WatchLaterApiService {
  private baseUrl = API_CONFIG.BASE_URL;

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('jwt_token');
    console.log('🔑 JWT Token from AsyncStorage:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      throw new Error('No JWT token found. Please log in again.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Get all watch later items for the current user
   */
  async getWatchLaterItems(): Promise<WatchLaterItem[]> {
    try {
      console.log('🌐 Fetching watch later items from:', `${this.baseUrl}/watch-later`);
      const headers = await this.getAuthHeaders();
      console.log('📋 Request headers:', headers);
      
      const response = await fetch(`${this.baseUrl}/watch-later`, {
        method: 'GET',
        headers,
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Watch later items received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching watch later items:', error);
      throw error;
    }
  }

  /**
   * Get watch later items by type (movie or series)
   */
  async getWatchLaterItemsByType(type: 'movie' | 'series'): Promise<WatchLaterItem[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/watch-later/type/${type}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${type} watch later items:`, error);
      throw error;
    }
  }

  /**
   * Add an item to watch later
   */
  async addToWatchLater(request: WatchLaterRequest): Promise<WatchLaterItem> {
    try {
      console.log('📤 Sending POST request to watch-later API');
      console.log('📤 Request URL:', `${this.baseUrl}/watch-later`);
      console.log('📤 Request body:', JSON.stringify(request, null, 2));
      
      const headers = await this.getAuthHeaders();
      console.log('📤 Request headers:', headers);
      
      const response = await fetch(`${this.baseUrl}/watch-later`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error adding to watch later:', error);
      throw error;
    }
  }

  /**
   * Remove an item from watch later
   */
  async removeFromWatchLater(contentId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/watch-later/${contentId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error removing from watch later:', error);
      throw error;
    }
  }

  /**
   * Check if an item is in watch later
   */
  async checkIfInWatchLater(contentId: string): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/watch-later/check/${contentId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.inWatchLater;
    } catch (error) {
      console.error('Error checking watch later status:', error);
      return false;
    }
  }

  /**
   * Get watch later count
   */
  async getWatchLaterCount(): Promise<number> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/watch-later/count`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Error getting watch later count:', error);
      return 0;
    }
  }

  /**
   * Add a movie to watch later
   */
  async addMovieToWatchLater(movie: {
    id: string;
    title: string;
    description?: string;
    poster?: string;
    backdrop?: string;
    year?: string;
    genre?: string;
    duration?: string;
    rating?: string;
  }): Promise<WatchLaterItem> {
    const request: WatchLaterRequest = {
      contentId: movie.id,
      title: movie.title,
      description: movie.description,
      poster: movie.poster,
      backdrop: movie.backdrop,
      year: movie.year,
      genre: movie.genre,
      type: 'movie',
      duration: movie.duration,
      rating: movie.rating,
    };

    return this.addToWatchLater(request);
  }

  /**
   * Add a series to watch later
   */
  async addSeriesToWatchLater(series: {
    id: string;
    title: string;
    description?: string;
    poster?: string;
    backdrop?: string;
    year?: string;
    genre?: string;
    rating?: string;
  }): Promise<WatchLaterItem> {
    const request: WatchLaterRequest = {
      contentId: series.id,
      title: series.title,
      description: series.description,
      poster: series.poster,
      backdrop: series.backdrop,
      year: series.year,
      genre: series.genre,
      type: 'series',
      rating: series.rating,
    };

    return this.addToWatchLater(request);
  }
}

export const watchLaterApiService = new WatchLaterApiService(); 