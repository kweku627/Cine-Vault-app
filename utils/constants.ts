// API Configuration
export const API_BASE_URL = 'http://10.171.140.120:8080'; // Update this to your backend URL

// App Configuration
export const APP_NAME = 'CineVault';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  JWT_TOKEN: 'jwt_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'language',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
  },
  CONTENT: {
    MOVIES: '/api/movies',
    SERIES: '/api/series',
    SEARCH: '/api/search',
  },
  ACTIONS: {
    LIKES: '/api/likes',
    WATCH_LATER: '/api/watch-later',
    RATINGS: '/api/ratings',
  },
};

// Theme Configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Content Types
export const CONTENT_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
} as const;

// Rating Configuration
export const RATING_CONFIG = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 0,
}; 