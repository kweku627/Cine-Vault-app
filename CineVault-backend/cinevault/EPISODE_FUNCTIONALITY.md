# Series Episode Functionality

This document describes the embedded episode functionality added to the `Series` entity using JPA's `@ElementCollection` and `@Embeddable` annotations.

## Overview

The `Series` entity now includes embedded episode data without requiring a separate `Episode` entity. Episodes are stored in a secondary table (`series_episodes`) and are managed through the `Series` entity.

## Database Schema

### Series Table
- `id` (Primary Key)
- `series_id` (Unique identifier)
- `title`, `overview`, `release_date`, etc.

### Series Episodes Table
- `series_id` (Foreign Key to series table)
- `season_number` (NOT NULL)
- `episode_number` (NOT NULL)
- `title` (NOT NULL)
- `overview` (TEXT)
- `release_date`
- `video_url`

## Model Classes

### Episode (Embeddable)
```java
@Embeddable
public class Episode {
    private Integer seasonNumber;
    private Integer episodeNumber;
    private String title;
    private String overview;
    private LocalDate releaseDate;
    private String videoUrl;
    // ... getters, setters, constructors
}
```

### Series (Entity)
```java
@Entity
@Table(name = "series")
public class Series {
    // ... existing fields
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "series_episodes",
        joinColumns = @JoinColumn(name = "series_id")
    )
    @OrderBy("seasonNumber ASC, episodeNumber ASC")
    private List<Episode> episodes = new ArrayList<>();
    
    // ... convenience methods for episode management
}
```

## API Endpoints

### Series Management
- `GET /series` - Get all series
- `GET /series/{seriesId}` - Get specific series
- `POST /series` - Create new series
- `PUT /series/{id}` - Update series
- `DELETE /series/{id}` - Delete series

### Episode Management
- `GET /series/{seriesId}/episodes` - Get all episodes for a series
- `GET /series/{seriesId}/episodes/{seasonNumber}/{episodeNumber}` - Get specific episode
- `GET /series/{seriesId}/episodes/season/{seasonNumber}` - Get episodes by season
- `POST /series/{seriesId}/episodes` - Add episode to series
- `PUT /series/{seriesId}/episodes/{seasonNumber}/{episodeNumber}` - Update episode
- `DELETE /series/{seriesId}/episodes/{seasonNumber}/{episodeNumber}` - Remove episode

## Usage Examples

### Creating a Series with Episodes
```java
Series series = new Series();
series.setSeriesId(1L);
series.setTitle("Breaking Bad");

Episode pilot = new Episode(1, 1, "Pilot", "Chemistry teacher turns to crime", 
                           LocalDate.of(2008, 1, 20), "http://example.com/pilot");
series.addEpisode(pilot);
```

### Finding Episodes
```java
// Find specific episode
Episode episode = series.findEpisode(1, 1);

// Get all episodes in a season
List<Episode> season1Episodes = series.getEpisodesBySeason(1);

// Get episode counts
int totalEpisodes = series.getTotalEpisodes();
int totalSeasons = series.getTotalSeasons();
```

### API Usage Examples

#### Add an Episode
```bash
POST /series/1/episodes
Content-Type: application/json

{
  "seasonNumber": 1,
  "episodeNumber": 1,
  "title": "Pilot",
  "overview": "Chemistry teacher turns to crime",
  "releaseDate": "2008-01-20",
  "videoUrl": "http://example.com/pilot"
}
```

#### Get Episodes by Season
```bash
GET /series/1/episodes/season/1
```

#### Update an Episode
```bash
PUT /series/1/episodes/1/1
Content-Type: application/json

{
  "seasonNumber": 1,
  "episodeNumber": 1,
  "title": "Pilot (Updated)",
  "overview": "Updated overview",
  "releaseDate": "2008-01-20",
  "videoUrl": "http://example.com/pilot-updated"
}
```

## Key Features

1. **Embedded Design**: Episodes are embedded within the Series entity, no separate entity needed
2. **Automatic Ordering**: Episodes are automatically ordered by season and episode number
3. **Lazy Loading**: Episodes are loaded lazily to improve performance
4. **Convenience Methods**: Series entity includes methods for common episode operations
5. **JSON Serialization**: Episodes are automatically included in JSON responses
6. **Validation**: Episode fields include proper validation annotations

## Database Migration

When deploying this update, the database will automatically create the `series_episodes` table. No manual migration is required as JPA will handle the schema generation.

## Testing

Run the test suite to verify functionality:
```bash
mvn test -Dtest=SeriesEpisodeTest
```

The tests cover:
- Adding and removing episodes
- Finding specific episodes
- Getting episodes by season
- Episode equality and comparison
- Edge cases (empty series, etc.) 