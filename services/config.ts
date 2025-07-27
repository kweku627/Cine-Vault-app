// API Configuration
export const API_CONFIG = {
  // Development - use local IP for mobile compatibility
  BASE_URL: 'http://10.133.19.135:8080/api',
  
  // Alternative URLs for different environments:
  // WEB: 'http://localhost:8080', // For web development (change BASE_URL above)
  // PRODUCTION: 'https://your-production-domain.com', // For production
};

// To switch between web and mobile development:
// - For WEB development: Change BASE_URL to 'http://localhost:8080'
// - For MOBILE development: Change BASE_URL to your local IP address (e.g., 'http://10.171.140.120:8080')

// Helper function to get the full API URL for a specific endpoint
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.replace(/^\//, '');
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
}; 