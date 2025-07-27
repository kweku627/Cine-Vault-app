import { TrailerContent, Comment } from '@/types/content';

interface ApiTrailerContent {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseYear: number;
  type: string;
  genre: string;
  duration: number;
  rating: number;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  videoUri: string;
}

interface ApiComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  parentCommentId?: string;
}

const mockTrailers: ApiTrailerContent[] = [
  {
    id: 1,
    title: 'The Perfect Brew',
    description: 'Discover the art of coffee making with master baristas from around the world.',
    posterUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
    backdropUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
    releaseYear: 2024,
    type: 'series',
    genre: 'Documentary',
    duration: 45,
    rating: 4.9,
    likes: 45200,
    comments: 1240,
    shares: 890,
    isLiked: false,
    isSaved: false,
    videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  // ... (other mock trailers unchanged)
];

const mockComments: ApiComment[] = [
  {
    id: '1',
    user: 'CoffeeEnthusiast',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'This looks absolutely amazing! Can\'t wait to watch it! ☕️',
    timestamp: '2h',
    likes: 24,
    isLiked: false,
    parentCommentId: undefined,
  },
  {
    id: '2',
    user: 'MovieBuff2024',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'The cinematography in this trailer is incredible! 🎬',
    timestamp: '4h',
    likes: 18,
    isLiked: false,
    parentCommentId: undefined,
  },
  {
    id: '3',
    user: 'StreamingFan',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'Adding this to my watchlist immediately! 🔥',
    timestamp: '6h',
    likes: 31,
    isLiked: false,
    parentCommentId: undefined,
  },
  {
    id: '4',
    user: 'BaristaLife',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'As a professional barista, I\'m so excited for this series! 💪',
    timestamp: '8h',
    likes: 42,
    isLiked: false,
    parentCommentId: undefined,
  },
  {
    id: '5',
    user: 'CoffeeAddict',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'Finally, quality coffee content! This is what we\'ve been waiting for ☕️✨',
    timestamp: '12h',
    likes: 67,
    isLiked: false,
    parentCommentId: undefined,
  },
];

export class TrailersApiService {
  private static baseUrl = 'https://api.cinevault.example.com';

  private static async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to load data');
      }
      return data.data;
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }

  static async getTrailers(): Promise<ApiTrailerContent[]> {
    try {
      return await this.fetchData<ApiTrailerContent[]>('trailers');
    } catch (error) {
      console.warn('Falling back to mock trailers data');
      return mockTrailers;
    }
  }

  static async getComments(trailerId: string): Promise<Comment[]> {
    try {
      const comments = await this.fetchData<ApiComment[]>(`trailers/${trailerId}/comments`);
      return comments.map((comment) => ({
        id: comment.id,
        user: comment.user,
        avatar: comment.avatar,
        text: comment.text,
        timestamp: comment.timestamp,
        likes: comment.likes,
        isLiked: comment.isLiked,
        parentCommentId: comment.parentCommentId,
      }));
    } catch (error) {
      console.warn(`Falling back to mock comments for trailer ${trailerId}`);
      return mockComments;
    }
  }

  static async addComment(trailerId: string, comment: Comment): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/trailers/${trailerId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: comment.user,
          avatar: comment.avatar,
          text: comment.text,
          timestamp: comment.timestamp,
          likes: comment.likes,
          isLiked: comment.isLiked,
          parentCommentId: comment.parentCommentId,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      mockComments.unshift({
        id: comment.id,
        user: comment.user,
        avatar: comment.avatar,
        text: comment.text,
        timestamp: comment.timestamp,
        likes: comment.likes,
        isLiked: comment.isLiked,
        parentCommentId: comment.parentCommentId,
      });
    }
  }

  static async likeComment(trailerId: string, commentId: string, isLiked: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/trailers/${trailerId}/comments/${commentId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLiked }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      const comment = mockComments.find((c) => c.id === commentId);
      if (comment) {
        comment.isLiked = isLiked;
        comment.likes = isLiked ? comment.likes + 1 : comment.likes - 1;
      }
    }
  }
}