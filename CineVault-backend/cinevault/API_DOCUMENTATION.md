# CineVault API Documentation

## Base URL
```
http://localhost:8080/api
```

## Series API Endpoints

### 1. Get All Series
**GET** `/series`

**Response:**
```json
[
  {
    "id": 1,
    "seriesId": 1399,
    "title": "Game of Thrones",
    "overview": "Nine noble families fight for control over the lands of Westeros...",
    "releaseDate": "2011-04-17",
    "posterPath": "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    "backdropPath": "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    "originalLanguage": "en",
    "voteAverage": 9.3,
    "voteCount": 19423,
    "popularity": 1000.0,
    "videoUrl": "http://example.com/got-trailer",
    "episodes": [
      {
        "seasonNumber": 1,
        "episodeNumber": 1,
        "title": "Winter Is Coming",
        "overview": "Lord Stark is torn between his family and an old friend...",
        "releaseDate": "2011-04-17",
        "videoUrl": "http://example.com/got-s1e1"
      }
    ]
  }
]
```

### 2. Get Series by ID
**GET** `/series/{seriesId}`

**Example:** `GET /series/1399`

**Response:**
```json
{
  "id": 1,
  "seriesId": 1399,
  "title": "Game of Thrones",
  "overview": "Nine noble families fight for control over the lands of Westeros...",
  "releaseDate": "2011-04-17",
  "posterPath": "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
  "backdropPath": "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
  "originalLanguage": "en",
  "voteAverage": 9.3,
  "voteCount": 19423,
  "popularity": 1000.0,
  "videoUrl": "http://example.com/got-trailer",
  "episodes": [
    {
      "seasonNumber": 1,
      "episodeNumber": 1,
      "title": "Winter Is Coming",
      "overview": "Lord Stark is torn between his family and an old friend...",
      "releaseDate": "2011-04-17",
      "videoUrl": "http://example.com/got-s1e1"
    },
    {
      "seasonNumber": 1,
      "episodeNumber": 2,
      "title": "The Kingsroad",
      "overview": "While Bran recovers from his fall...",
      "releaseDate": "2011-04-24",
      "videoUrl": "http://example.com/got-s1e2"
    }
  ]
}
```

### 3. Create New Series
**POST** `/series`

**Request Body:**
```json
{
  "seriesId": 1399,
  "title": "Game of Thrones",
  "overview": "Nine noble families fight for control over the lands of Westeros...",
  "releaseDate": "2011-04-17",
  "posterPath": "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
  "backdropPath": "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
  "originalLanguage": "en",
  "voteAverage": 9.3,
  "voteCount": 19423,
  "popularity": 1000.0,
  "videoUrl": "http://example.com/got-trailer",
  "episodes": [
    {
      "seasonNumber": 1,
      "episodeNumber": 1,
      "title": "Winter Is Coming",
      "overview": "Lord Stark is torn between his family and an old friend...",
      "releaseDate": "2011-04-17",
      "videoUrl": "http://example.com/got-s1e1"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "seriesId": 1399,
  "title": "Game of Thrones",
  // ... same as request body
}
```

### 4. Update Series
**PUT** `/series/{id}`

**Example:** `PUT /series/1`

**Request Body:** (same format as POST)

**Response:** `200 OK`
```json
{
  "id": 1,
  "seriesId": 1399,
  "title": "Game of Thrones (Updated)",
  // ... updated fields
}
```

### 5. Delete Series
**DELETE** `/series/{id}`

**Example:** `DELETE /series/1`

**Response:** `204 No Content`

---

## Episode Management API Endpoints

### 1. Get All Episodes for a Series
**GET** `/series/{seriesId}/episodes`

**Example:** `GET /series/1399/episodes`

**Response:**
```json
[
  {
    "seasonNumber": 1,
    "episodeNumber": 1,
    "title": "Winter Is Coming",
    "overview": "Lord Stark is torn between his family and an old friend...",
    "releaseDate": "2011-04-17",
    "videoUrl": "http://example.com/got-s1e1"
  },
  {
    "seasonNumber": 1,
    "episodeNumber": 2,
    "title": "The Kingsroad",
    "overview": "While Bran recovers from his fall...",
    "releaseDate": "2011-04-24",
    "videoUrl": "http://example.com/got-s1e2"
  },
  {
    "seasonNumber": 2,
    "episodeNumber": 1,
    "title": "The North Remembers",
    "overview": "Tyrion arrives at King's Landing...",
    "releaseDate": "2012-04-01",
    "videoUrl": "http://example.com/got-s2e1"
  }
]
```

### 2. Get Episodes by Season
**GET** `/series/{seriesId}/episodes/season/{seasonNumber}`

**Example:** `GET /series/1399/episodes/season/1`

**Response:**
```json
[
  {
    "seasonNumber": 1,
    "episodeNumber": 1,
    "title": "Winter Is Coming",
    "overview": "Lord Stark is torn between his family and an old friend...",
    "releaseDate": "2011-04-17",
    "videoUrl": "http://example.com/got-s1e1"
  },
  {
    "seasonNumber": 1,
    "episodeNumber": 2,
    "title": "The Kingsroad",
    "overview": "While Bran recovers from his fall...",
    "releaseDate": "2011-04-24",
    "videoUrl": "http://example.com/got-s1e2"
  }
]
```

### 3. Get Specific Episode
**GET** `/series/{seriesId}/episodes/{seasonNumber}/{episodeNumber}`

**Example:** `GET /series/1399/episodes/1/1`

**Response:**
```json
{
  "seasonNumber": 1,
  "episodeNumber": 1,
  "title": "Winter Is Coming",
  "overview": "Lord Stark is torn between his family and an old friend...",
  "releaseDate": "2011-04-17",
  "videoUrl": "http://example.com/got-s1e1"
}
```

### 4. Add Episode to Series
**POST** `/series/{seriesId}/episodes`

**Example:** `POST /series/1399/episodes`

**Request Body:**
```json
{
  "seasonNumber": 1,
  "episodeNumber": 3,
  "title": "Lord Snow",
  "overview": "Jon Snow begins his training with the Night's Watch...",
  "releaseDate": "2011-05-01",
  "videoUrl": "http://example.com/got-s1e3"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "seriesId": 1399,
  "title": "Game of Thrones",
  // ... series data
  "episodes": [
    // ... existing episodes
    {
      "seasonNumber": 1,
      "episodeNumber": 3,
      "title": "Lord Snow",
      "overview": "Jon Snow begins his training with the Night's Watch...",
      "releaseDate": "2011-05-01",
      "videoUrl": "http://example.com/got-s1e3"
    }
  ]
}
```

### 5. Update Episode
**PUT** `/series/{seriesId}/episodes/{seasonNumber}/{episodeNumber}`

**Example:** `PUT /series/1399/episodes/1/1`

**Request Body:**
```json
{
  "seasonNumber": 1,
  "episodeNumber": 1,
  "title": "Winter Is Coming (Extended)",
  "overview": "Lord Stark is torn between his family and an old friend. Extended version with additional scenes...",
  "releaseDate": "2011-04-17",
  "videoUrl": "http://example.com/got-s1e1-extended"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "seriesId": 1399,
  "title": "Game of Thrones",
  // ... series data with updated episode
}
```

### 6. Remove Episode
**DELETE** `/series/{seriesId}/episodes/{seasonNumber}/{episodeNumber}`

**Example:** `DELETE /series/1399/episodes/1/3`

**Response:** `200 OK`
```json
{
  "id": 1,
  "seriesId": 1399,
  "title": "Game of Thrones",
  // ... series data without the deleted episode
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-15T10:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Series ID and title are required"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-15T10:30:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Series not found with ID: 9999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-15T10:30:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Complete API Example Workflow

### 1. Create a Series
```bash
curl -X POST http://localhost:8080/series \
  -H "Content-Type: application/json" \
  -d '{
    "seriesId": 1399,
    "title": "Game of Thrones",
    "overview": "Nine noble families fight for control over the lands of Westeros...",
    "releaseDate": "2011-04-17",
    "posterPath": "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    "originalLanguage": "en",
    "voteAverage": 9.3,
    "voteCount": 19423,
    "popularity": 1000.0
  }'
```

### 2. Add Episodes
```bash
# Add first episode
curl -X POST http://localhost:8080/series/1399/episodes \
  -H "Content-Type: application/json" \
  -d '{
    "seasonNumber": 1,
    "episodeNumber": 1,
    "title": "Winter Is Coming",
    "overview": "Lord Stark is torn between his family and an old friend...",
    "releaseDate": "2011-04-17",
    "videoUrl": "http://example.com/got-s1e1"
  }'

# Add second episode
curl -X POST http://localhost:8080/series/1399/episodes \
  -H "Content-Type: application/json" \
  -d '{
    "seasonNumber": 1,
    "episodeNumber": 2,
    "title": "The Kingsroad",
    "overview": "While Bran recovers from his fall...",
    "releaseDate": "2011-04-24",
    "videoUrl": "http://example.com/got-s1e2"
  }'
```

### 3. Retrieve Data
```bash
# Get all episodes
curl http://localhost:8080/series/1399/episodes

# Get episodes by season
curl http://localhost:8080/series/1399/episodes/season/1

# Get specific episode
curl http://localhost:8080/series/1399/episodes/1/1
```

### 4. Update Episode
```bash
curl -X PUT http://localhost:8080/series/1399/episodes/1/1 \
  -H "Content-Type: application/json" \
  -d '{
    "seasonNumber": 1,
    "episodeNumber": 1,
    "title": "Winter Is Coming (Director Cut)",
    "overview": "Extended version with additional scenes...",
    "releaseDate": "2011-04-17",
    "videoUrl": "http://example.com/got-s1e1-director-cut"
  }'
```

### 5. Remove Episode
```bash
curl -X DELETE http://localhost:8080/series/1399/episodes/1/2
```

---

## API Features

✅ **RESTful Design**: Follows REST principles  
✅ **JSON Format**: All requests/responses use JSON  
✅ **Proper HTTP Status Codes**: 200, 201, 204, 400, 404, 500  
✅ **Nested Resources**: Episodes are nested under Series  
✅ **CRUD Operations**: Complete Create, Read, Update, Delete  
✅ **Error Handling**: Proper error responses with messages  
✅ **Validation**: Input validation with meaningful error messages  
✅ **Consistent Format**: Uniform request/response structure  
✅ **Flexible Queries**: Get all episodes, by season, or specific episode  
✅ **Automatic Ordering**: Episodes returned in season/episode order 