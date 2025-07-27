# Watch Later API Documentation

The Watch Later feature allows users to save movies and series to watch later. All endpoints require authentication via JWT token.

## Base URL
```
/watch-later
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Add to Watch Later
**POST** `/watch-later`

Add a movie or series to the user's watch later list.

**Request Body:**
```json
{
  "contentId": 123,
  "contentType": "MOVIE", // or "SERIES"
  "notes": "Optional notes about this content"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "contentId": 123,
  "contentType": "MOVIE",
  "contentTitle": "Movie Title",
  "contentOverview": "Movie description...",
  "posterPath": "/path/to/poster.jpg",
  "backdropPath": "/path/to/backdrop.jpg",
  "voteAverage": 8.5,
  "voteCount": 1000,
  "addedAt": "2024-01-15T10:30:00",
  "notes": "Optional notes"
}
```

### 2. Get Watch Later List
**GET** `/watch-later`

Get all items in the user's watch later list.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "contentId": 123,
    "contentType": "MOVIE",
    "contentTitle": "Movie Title",
    "contentOverview": "Movie description...",
    "posterPath": "/path/to/poster.jpg",
    "backdropPath": "/path/to/backdrop.jpg",
    "voteAverage": 8.5,
    "voteCount": 1000,
    "addedAt": "2024-01-15T10:30:00",
    "notes": "Optional notes"
  }
]
```

### 3. Get Watch Later by Type
**GET** `/watch-later/type/{contentType}`

Get watch later items filtered by content type (MOVIE or SERIES).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "contentId": 123,
    "contentType": "MOVIE",
    "contentTitle": "Movie Title",
    "contentOverview": "Movie description...",
    "posterPath": "/path/to/poster.jpg",
    "backdropPath": "/path/to/backdrop.jpg",
    "voteAverage": 8.5,
    "voteCount": 1000,
    "addedAt": "2024-01-15T10:30:00",
    "notes": "Optional notes"
  }
]
```

### 4. Check Watch Later Status
**GET** `/watch-later/check/{contentId}?contentType={contentType}`

Check if a specific content is in the user's watch later list.

**Response (200 OK):**
```json
{
  "inWatchLater": true
}
```

### 5. Get Watch Later Count
**GET** `/watch-later/count`

Get the count of watch later items for the user.

**Response (200 OK):**
```json
{
  "totalCount": 5,
  "movieCount": 3,
  "seriesCount": 2
}
```

### 6. Update Notes
**PUT** `/watch-later/{contentId}/notes?contentType={contentType}`

Update notes for a specific watch later item.

**Request Body:**
```json
{
  "notes": "Updated notes about this content"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "contentId": 123,
  "contentType": "MOVIE",
  "contentTitle": "Movie Title",
  "contentOverview": "Movie description...",
  "posterPath": "/path/to/poster.jpg",
  "backdropPath": "/path/to/backdrop.jpg",
  "voteAverage": 8.5,
  "voteCount": 1000,
  "addedAt": "2024-01-15T10:30:00",
  "notes": "Updated notes about this content"
}
```

### 7. Remove from Watch Later
**DELETE** `/watch-later/{contentId}?contentType={contentType}`

Remove a specific content from the user's watch later list.

**Response (200 OK):**
```json
{
  "message": "Removed from watch later list"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Content already exists in watch later list"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

## Content Types

- `MOVIE`: For movie content
- `SERIES`: For series content

## Usage Examples

### Adding a Movie to Watch Later
```bash
curl -X POST http://localhost:8080/watch-later \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": 123,
    "contentType": "MOVIE",
    "notes": "Looks interesting!"
  }'
```

### Getting Watch Later List
```bash
curl -X GET http://localhost:8080/watch-later \
  -H "Authorization: Bearer your-jwt-token"
```

### Checking if Movie is in Watch Later
```bash
curl -X GET "http://localhost:8080/watch-later/check/123?contentType=MOVIE" \
  -H "Authorization: Bearer your-jwt-token"
```

### Removing from Watch Later
```bash
curl -X DELETE "http://localhost:8080/watch-later/123?contentType=MOVIE" \
  -H "Authorization: Bearer your-jwt-token"
``` 