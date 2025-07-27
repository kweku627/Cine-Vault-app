import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './config';

export interface LikeRequest {
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
}

export interface WatchLaterRequest {
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  title: string;
  poster: string;
  year: string;
}

export interface RatingRequest {
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  rating: number;
}

export class UserActionsService {
  // Like functionality
  static async likeContent(request: LikeRequest): Promise<void> {
    try {
      const response = await fetch(getApiUrl('likes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to like content');
      }
    } catch (error) {
      console.error('Error liking content:', error);
      throw error;
    }
  }

  static async unlikeContent(request: LikeRequest): Promise<void> {
    try {
      const response = await fetch(getApiUrl('likes'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to unlike content');
      }
    } catch (error) {
      console.error('Error unliking content:', error);
      throw error;
    }
  }

  static async getLikedContent(userId: string): Promise<any[]> {
    try {
      const response = await fetch(getApiUrl(`likes/user/${userId}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch liked content');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching liked content:', error);
      throw error;
    }
  }

  // Watch Later functionality
  static async addToWatchLater(request: WatchLaterRequest): Promise<void> {
    try {
      const response = await fetch(getApiUrl('watch-later'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to add to watch later');
      }
    } catch (error) {
      console.error('Error adding to watch later:', error);
      throw error;
    }
  }

  static async removeFromWatchLater(userId: string, contentId: string): Promise<void> {
    try {
      const response = await fetch(getApiUrl(`watch-later/${userId}/${contentId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from watch later');
      }
    } catch (error) {
      console.error('Error removing from watch later:', error);
      throw error;
    }
  }

  static async getWatchLaterList(userId: string): Promise<any[]> {
    try {
      const response = await fetch(getApiUrl(`watch-later/user/${userId}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch watch later list');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching watch later list:', error);
      throw error;
    }
  }

  // Rating functionality
  static async rateContent(request: RatingRequest): Promise<void> {
    try {
      const response = await fetch(getApiUrl('ratings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to rate content');
      }
    } catch (error) {
      console.error('Error rating content:', error);
      throw error;
    }
  }

  static async updateRating(request: RatingRequest): Promise<void> {
    try {
      const response = await fetch(getApiUrl('ratings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  }

  static async getContentRating(contentId: string): Promise<any> {
    try {
      const response = await fetch(getApiUrl(`ratings/content/${contentId}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch content rating');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching content rating:', error);
      throw error;
    }
  }

  static async getUserRatings(userId: string): Promise<any[]> {
    try {
      const response = await fetch(getApiUrl(`ratings/user/${userId}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch user ratings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      throw error;
    }
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(getApiUrl('users/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }
    return data;
  }

  static async deleteAccount(userId: number) {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(getApiUrl(`users/${userId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to delete account');
    }
    await AsyncStorage.removeItem('jwt_token');
    return true;
  }

  static async fetchUserById(userId: number | string): Promise<any> {
    try {
      const response = await fetch(getApiUrl(`users/${userId}`));
      if (!response.ok) {
        throw new Error('User not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }
} 