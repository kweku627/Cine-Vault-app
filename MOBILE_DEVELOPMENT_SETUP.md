# Mobile Development Setup

## Problem Solved
The app was showing movies on the browser but not on mobile devices because it was using `localhost:8080` which only works for web development.

## Solution
Updated all API services to use your computer's IP address (`10.124.233.120:8080`) instead of `localhost:8080`.

## Configuration
The API base URL is now centralized in `services/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://10.124.233.120:8080', // Currently set for mobile development
};
```

## How to Change API URL
To switch between different environments, update the `BASE_URL` in `services/config.ts`:

### For Web Development:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
};
```

### For Mobile Testing (Current Setup):
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://10.124.233.120:8080', // Your computer's IP address
};
```

### For Production:
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-production-domain.com',
};
```

## Services Updated
- ✅ `MoviesApiService.ts` - Movie data fetching
- ✅ `AuthApiService.ts` - User authentication
- ✅ `SeriesApiService.ts` - Series data fetching
- ✅ `VideoScraperService.ts` - Video URL scraping

## Backend Configuration
The backend is already configured to accept connections from any IP address with:
```
server.address=0.0.0.0
```

## Testing
- ✅ Movies now load on mobile devices
- ✅ API calls work from phone to development server
- ✅ All services use centralized configuration

## Future Development
For production deployment, update the `BASE_URL` in `services/config.ts` to your production server URL. 