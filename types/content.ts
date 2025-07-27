export interface Content {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop?: string;
  year: number;
  type: 'movie' | 'series';
  genre: string;
  duration: number;
  rating: number;
  videoUri?: string;
}

export interface Category {
  id: string;
  name: string;
  content: Content[];
}

export interface Download extends Content {
  size: number;
  downloadedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  watchedCount: number;
  watchlistCount: number;
  downloadsCount: number;
}

export interface SearchFilters {
  type: 'all' | 'movie' | 'series';
  genre: string;
  year: string;
}

export interface TrailerContent extends Content {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  videoUri: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean; // Added for like functionality
  parentCommentId?: string; // Added for replies

}

// Extended interface for featured content with string rating for display
export interface FeaturedContent extends Omit<Content, 'rating'> {
  rating: string; // Display rating as string (e.g., "4.9")
}

// Extended interface for content categories with movies array
export interface ContentCategory extends Category {
  movies: Content[];
}