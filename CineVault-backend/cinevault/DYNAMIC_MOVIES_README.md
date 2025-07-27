# 🎬 Dynamic Movie Loading System

## Overview
This system fetches movies dynamically from TMDB API and generates video links using vidsrc.to, providing real-time movie data without storing it in your local database.

## 🚀 New Endpoints

### **Test Movies (No API Key Required)**
```
GET /api/test-movies
GET /api/test-movies/popular
GET /api/test-movies/search?query={searchTerm}
```

### **External Movies (Requires TMDB API Key)**
```
GET /api/external-movies
GET /api/external-movies/popular
GET /api/external-movies/trending
GET /api/external-movies/search?query={searchTerm}
GET /api/external-movies/genre/{genreId}
GET /api/external-movies/{tmdbId}
```

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "page": 1,
  "results": [
    {
      "id": 603,
      "title": "The Matrix",
      "overview": "A computer hacker learns from mysterious rebels...",
      "poster_path": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      "video_link": "https://vidsrc.to/embed/movie/603",
      "release_date": "1999-03-31",
      "vote_average": 8.7,
      "vote_count": 25000,
      "genre": "Action"
    }
  ],
  "total_results": 8,
  "message": "Sample movies for testing"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Failed to fetch movies: API key required"
}
```

## 🔧 Setup Instructions

### 1. Get TMDB API Key
1. Go to [TMDB](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Copy your API key

### 2. Configure Environment Variables
Add to your `application.properties` or environment:
```properties
TMDB_API_KEY=your_actual_tmdb_api_key_here
```

### 3. Restart Application
```bash
mvn spring-boot:run
```

## 🧪 Testing

### Test Without API Key
```bash
# Get sample movies
curl http://10.132.2.133:8080/api/test-movies

# Search sample movies
curl "http://10.132.2.133:8080/api/test-movies/search?query=matrix"
```

### Test With API Key
```bash
# Get popular movies from TMDB
curl http://10.132.2.133:8080/api/external-movies/popular

# Search movies on TMDB
curl "http://10.132.2.133:8080/api/external-movies/search?query=batman"
```

## 📱 Frontend Integration

### JavaScript Example
```javascript
// Fetch sample movies (no API key needed)
async function getSampleMovies() {
    try {
        const response = await fetch('http://10.132.2.133:8080/api/test-movies');
        const data = await response.json();
        
        if (data.success) {
            displayMovies(data.results);
        }
    } catch (error) {
        console.error('Failed to fetch movies:', error);
    }
}

// Fetch from TMDB (requires API key)
async function getPopularMovies() {
    try {
        const response = await fetch('http://10.132.2.133:8080/api/external-movies/popular');
        const data = await response.json();
        
        if (data.success) {
            displayMovies(data.results);
        }
    } catch (error) {
        console.error('Failed to fetch popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.overview}</p>
                <button onclick="watchMovie(${movie.id})">Watch Movie</button>
            </div>
        `;
        container.innerHTML += movieCard;
    });
}

// Watch movie
function watchMovie(tmdbId) {
    const videoUrl = `https://vidsrc.to/embed/movie/${tmdbId}`;
    window.open(videoUrl, '_blank');
}
```

### React Example
```jsx
import React, { useState, useEffect } from 'react';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://10.132.2.133:8080/api/test-movies');
            const data = await response.json();
            
            if (data.success) {
                setMovies(data.results);
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const watchMovie = (tmdbId) => {
        const videoUrl = `https://vidsrc.to/embed/movie/${tmdbId}`;
        window.open(videoUrl, '_blank');
    };

    if (loading) return <div>Loading movies...</div>;

    return (
        <div className="movies-grid">
            {movies.map(movie => (
                <div key={movie.id} className="movie-card">
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                    <button onClick={() => watchMovie(movie.id)}>
                        Watch Movie
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MovieList;
```

## 🎯 Key Features

### ✅ Dynamic Data Fetching
- Fetches real-time movie data from TMDB API
- No local database storage required
- Always up-to-date movie information

### ✅ Video Link Generation
- Automatically generates vidsrc.to embed URLs
- Ready-to-use video streaming links
- Compatible with iframe embedding

### ✅ Multiple Data Sources
- **Test Movies**: Sample data (no API key required)
- **External Movies**: Real TMDB data (requires API key)
- **Popular Movies**: Trending content
- **Search Functionality**: Find specific movies

### ✅ Error Handling
- Graceful fallbacks when API is unavailable
- Clear error messages
- Sample data for testing

### ✅ CORS Enabled
- Cross-origin requests allowed
- Frontend integration ready
- Multiple origin support

## 🔍 API Endpoints Summary

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/test-movies` | GET | Sample movies for testing | ❌ |
| `/api/test-movies/popular` | GET | Popular sample movies | ❌ |
| `/api/test-movies/search` | GET | Search sample movies | ❌ |
| `/api/external-movies` | GET | All movies from TMDB | ✅ |
| `/api/external-movies/popular` | GET | Popular movies from TMDB | ✅ |
| `/api/external-movies/trending` | GET | Trending movies from TMDB | ✅ |
| `/api/external-movies/search` | GET | Search movies on TMDB | ✅ |
| `/api/external-movies/genre/{id}` | GET | Movies by genre | ✅ |
| `/api/external-movies/{id}` | GET | Movie by TMDB ID | ✅ |

## 🚀 Quick Start

1. **Test without setup:**
   ```
   http://10.132.2.133:8080/api/test-movies
   ```

2. **Get TMDB API key and configure:**
   ```
   TMDB_API_KEY=your_key_here
   ```

3. **Use real TMDB data:**
   ```
   http://10.132.2.133:8080/api/external-movies/popular
   ```

4. **Watch movies:**
   ```
   https://vidsrc.to/embed/movie/603
   ```

## 🎉 Benefits

- **No Database Dependency**: Movies fetched dynamically
- **Real-time Data**: Always current movie information
- **Video Integration**: Direct streaming links
- **Scalable**: Easy to add more features
- **Test-friendly**: Sample data for development
- **Production Ready**: TMDB integration for live data

Your CineVault now has a complete dynamic movie loading system! 🎬✨ 