# 🎬 TMDB Trailer API Documentation

The TMDB Trailer API allows you to fetch official trailers for movies and TV series directly from The Movie Database (TMDB). This integration provides YouTube embed URLs and thumbnails for seamless trailer playback.

## Overview

### Features:
- ✅ **Fetch movie trailers** by TMDB Movie ID
- ✅ **Fetch series trailers** by TMDB Series ID
- ✅ **YouTube embed URLs** for direct playback
- ✅ **High-quality thumbnails** from YouTube
- ✅ **Sample data** for testing (no API key required)
- ✅ **Official trailer filtering** (only official trailers)
- ✅ **Multiple trailer support** per movie/series

### TMDB API Integration:
- **Real TMDB API**: When you have a valid TMDB API key
- **Sample Data**: When no API key is configured (for testing)

## Base URLs
```
/api/tmdb-trailers
```

## API Endpoints

### 1. Get Movie Trailers
**GET** `/api/tmdb-trailers/movie/{tmdbMovieId}`

Fetch all official trailers for a specific movie by its TMDB ID.

**Parameters:**
- `tmdbMovieId` (path): The TMDB Movie ID (e.g., 603 for The Matrix)

**Response (200 OK):**
```json
{
  "success": true,
  "movieId": 603,
  "trailers": [
    {
      "id": "m8e-FF8MsqU",
      "title": "The Matrix - Official Trailer",
      "videoUrl": "https://www.youtube.com/embed/m8e-FF8MsqU",
      "thumbnailUrl": "https://img.youtube.com/vi/m8e-FF8MsqU/maxresdefault.jpg",
      "site": "YouTube",
      "type": "Trailer",
      "size": 1080,
      "official": true
    },
    {
      "id": "vKQi3bBA1y8",
      "title": "The Matrix Reloaded - Official Trailer",
      "videoUrl": "https://www.youtube.com/embed/vKQi3bBA1y8",
      "thumbnailUrl": "https://img.youtube.com/vi/vKQi3bBA1y8/maxresdefault.jpg",
      "site": "YouTube",
      "type": "Trailer",
      "size": 1080,
      "official": true
    }
  ],
  "count": 2
}
```

### 2. Get Series Trailers
**GET** `/api/tmdb-trailers/series/{tmdbSeriesId}`

Fetch all official trailers for a specific TV series by its TMDB ID.

**Parameters:**
- `tmdbSeriesId` (path): The TMDB Series ID (e.g., 1399 for Game of Thrones)

**Response (200 OK):**
```json
{
  "success": true,
  "seriesId": 1399,
  "trailers": [
    {
      "id": "HhesaQXLuRY",
      "title": "Stranger Things - Official Trailer",
      "videoUrl": "https://www.youtube.com/embed/HhesaQXLuRY",
      "thumbnailUrl": "https://img.youtube.com/vi/HhesaQXLuRY/maxresdefault.jpg",
      "site": "YouTube",
      "type": "Trailer",
      "size": 1080,
      "official": true
    }
  ],
  "count": 1
}
```

### 3. Get Sample Movie Trailers (No API Key Required)
**GET** `/api/tmdb-trailers/sample/movie`

Get sample movie trailers for testing without requiring a TMDB API key.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sample movie trailers (no API key required)",
  "trailers": [
    {
      "id": "m8e-FF8MsqU",
      "title": "The Matrix - Official Trailer",
      "videoUrl": "https://www.youtube.com/embed/m8e-FF8MsqU",
      "thumbnailUrl": "https://img.youtube.com/vi/m8e-FF8MsqU/maxresdefault.jpg",
      "site": "YouTube",
      "type": "Trailer",
      "size": 1080,
      "official": true
    }
  ],
  "count": 1
}
```

### 4. Get Sample Series Trailers (No API Key Required)
**GET** `/api/tmdb-trailers/sample/series`

Get sample series trailers for testing without requiring a TMDB API key.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sample series trailers (no API key required)",
  "trailers": [
    {
      "id": "HhesaQXLuRY",
      "title": "Stranger Things - Official Trailer",
      "videoUrl": "https://www.youtube.com/embed/HhesaQXLuRY",
      "thumbnailUrl": "https://img.youtube.com/vi/HhesaQXLuRY/maxresdefault.jpg",
      "site": "YouTube",
      "type": "Trailer",
      "size": 1080,
      "official": true
    }
  ],
  "count": 1
}
```

## Trailer Object Structure

### Trailer Properties:
- **id**: YouTube video key (e.g., "m8e-FF8MsqU")
- **title**: Trailer title/name
- **videoUrl**: YouTube embed URL for direct playback
- **thumbnailUrl**: High-quality YouTube thumbnail
- **site**: Video platform (always "YouTube")
- **type**: Video type (always "Trailer")
- **size**: Video quality (e.g., 1080 for 1080p)
- **official**: Whether it's an official trailer (true/false)

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid TMDB Movie ID"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch movie trailers: API key required"
}
```

## Setup Instructions

### 1. Get TMDB API Key (Optional)
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

## Usage Examples

### Test Without API Key
```bash
# Get sample movie trailers
curl http://localhost:8080/api/tmdb-trailers/sample/movie

# Get sample series trailers
curl http://localhost:8080/api/tmdb-trailers/sample/series
```

### With TMDB API Key
```bash
# Get trailers for The Matrix (TMDB ID: 603)
curl http://localhost:8080/api/tmdb-trailers/movie/603

# Get trailers for Game of Thrones (TMDB ID: 1399)
curl http://localhost:8080/api/tmdb-trailers/series/1399
```

### PowerShell Examples
```powershell
# Get sample movie trailers
Invoke-WebRequest -Uri "http://localhost:8080/api/tmdb-trailers/sample/movie" -Method GET

# Get movie trailers by TMDB ID
Invoke-WebRequest -Uri "http://localhost:8080/api/tmdb-trailers/movie/603" -Method GET
```

## Frontend Integration

### HTML Video Player
```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/m8e-FF8MsqU" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

### JavaScript Example
```javascript
// Fetch movie trailers
async function getMovieTrailers(tmdbMovieId) {
  const response = await fetch(`/api/tmdb-trailers/movie/${tmdbMovieId}`);
  const data = await response.json();
  
  if (data.success) {
    data.trailers.forEach(trailer => {
      console.log(`Trailer: ${trailer.title}`);
      console.log(`Video URL: ${trailer.videoUrl}`);
      console.log(`Thumbnail: ${trailer.thumbnailUrl}`);
    });
  }
}

// Usage
getMovieTrailers(603); // The Matrix
```

### React Example
```jsx
import React, { useState, useEffect } from 'react';

function TrailerPlayer({ tmdbMovieId }) {
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    fetch(`/api/tmdb-trailers/movie/${tmdbMovieId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTrailers(data.trailers);
          if (data.trailers.length > 0) {
            setSelectedTrailer(data.trailers[0]);
          }
        }
      });
  }, [tmdbMovieId]);

  return (
    <div>
      {selectedTrailer && (
        <iframe
          width="560"
          height="315"
          src={selectedTrailer.videoUrl}
          title={selectedTrailer.title}
          frameBorder="0"
          allowFullScreen
        />
      )}
      
      <div className="trailer-thumbnails">
        {trailers.map(trailer => (
          <img
            key={trailer.id}
            src={trailer.thumbnailUrl}
            alt={trailer.title}
            onClick={() => setSelectedTrailer(trailer)}
            style={{ cursor: 'pointer', margin: '5px' }}
          />
        ))}
      </div>
    </div>
  );
}
```

## Popular TMDB IDs for Testing

### Movies:
- **The Matrix**: 603
- **Inception**: 27205
- **The Dark Knight**: 155
- **Avengers: Endgame**: 299534
- **Titanic**: 597

### TV Series:
- **Game of Thrones**: 1399
- **Breaking Bad**: 1396
- **Stranger Things**: 66732
- **The Walking Dead**: 1402
- **Friends**: 1668

## TMDB API Endpoints Used

### Movie Videos
```
GET https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={api_key}
```

### TV Series Videos
```
GET https://api.themoviedb.org/3/tv/{series_id}/videos?api_key={api_key}
```

## Features

### Automatic Filtering:
- **YouTube only**: Only YouTube videos are included
- **Trailers only**: Only videos marked as "Trailer" type
- **Official trailers**: Prioritizes official trailers when available

### Video Quality:
- **High-quality thumbnails**: Uses maxresdefault.jpg for best quality
- **Embed URLs**: Direct YouTube embed URLs for seamless integration
- **Multiple formats**: Supports different video qualities

### Error Handling:
- **Graceful fallback**: Returns sample data when API key is missing
- **Detailed error messages**: Clear error responses for debugging
- **Input validation**: Validates TMDB IDs before making requests 