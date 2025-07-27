import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './config';

export interface FeedbackRequest {
  message: string;
  category?: string;
  rating?: number;
}

export interface FeedbackResponse {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'CLOSED';
  category?: string;
  rating?: number;
}

export class FeedbackApiService {
  static async sendFeedback(feedback: FeedbackRequest): Promise<FeedbackResponse> {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(getApiUrl('feedback'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to send feedback: ${response.status}`);
    }

    return response.json();
  }

  static async getUserFeedback(): Promise<FeedbackResponse[]> {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(getApiUrl('feedback'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get feedback: ${response.status}`);
    }

    return response.json();
  }
} 