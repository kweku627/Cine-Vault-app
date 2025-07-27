package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.dto.MovieDto;
import com.cinevault.cinevault.service.TmdbMovieService;
import com.cinevault.cinevault.service.VideoUrlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/external-movies")
@CrossOrigin(origins = "*")
public class ExternalMovieController {
    
    private final TmdbMovieService tmdbMovieService;
    private final VideoUrlService videoUrlService;
    
    public ExternalMovieController(TmdbMovieService tmdbMovieService, VideoUrlService videoUrlService) {
        this.tmdbMovieService = tmdbMovieService;
        this.videoUrlService = videoUrlService;
    }
    
    /**
     * Get popular movies from TMDB
     * GET /api/external-movies/popular
     */
    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularMovies(
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<MovieDto> movies = tmdbMovieService.getPopularMovies(page);
            
            // Check if we got any results from TMDB
            if (movies.isEmpty()) {
                // Fallback to sample data if TMDB API fails
                List<MovieDto> sampleMovies = createSampleMovies().subList(0, 5); // First 5 movies
                response.put("success", true);
                response.put("page", page);
                response.put("results", sampleMovies);
                response.put("total_results", sampleMovies.size());
                response.put("message", "Using sample data (TMDB API key not configured)");
                response.put("note", "To get real TMDB data, set TMDB_API_KEY environment variable");
                
                return ResponseEntity.ok(response);
            }
            
            response.put("success", true);
            response.put("page", page);
            response.put("results", movies);
            response.put("total_results", movies.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch popular movies: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get trending movies from TMDB
     * GET /api/external-movies/trending
     */
    @GetMapping("/trending")
    public ResponseEntity<Map<String, Object>> getTrendingMovies(
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<MovieDto> movies = tmdbMovieService.getTrendingMovies(page);
            
            // Check if we got any results from TMDB
            if (movies.isEmpty()) {
                // Fallback to sample data if TMDB API fails
                List<MovieDto> sampleMovies = createSampleMovies().subList(5, 8); // Last 3 movies
                response.put("success", true);
                response.put("page", page);
                response.put("results", sampleMovies);
                response.put("total_results", sampleMovies.size());
                response.put("message", "Using sample data (TMDB API key not configured)");
                response.put("note", "To get real TMDB data, set TMDB_API_KEY environment variable");
                
                return ResponseEntity.ok(response);
            }
            
            response.put("success", true);
            response.put("page", page);
            response.put("results", movies);
            response.put("total_results", movies.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch trending movies: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Search movies by title
     * GET /api/external-movies/search?query={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Search query is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            List<MovieDto> movies = tmdbMovieService.searchMovies(query.trim(), page);
            
            response.put("success", true);
            response.put("query", query);
            response.put("page", page);
            response.put("results", movies);
            response.put("total_results", movies.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to search movies: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get movies by genre
     * GET /api/external-movies/genre/{genreId}
     */
    @GetMapping("/genre/{genreId}")
    public ResponseEntity<Map<String, Object>> getMoviesByGenre(
            @PathVariable int genreId,
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<MovieDto> movies = tmdbMovieService.getMoviesByGenre(genreId, page);
            
            response.put("success", true);
            response.put("genre_id", genreId);
            response.put("page", page);
            response.put("results", movies);
            response.put("total_results", movies.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch movies by genre: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get all movies (combines popular and trending)
     * GET /api/external-movies
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllMovies(
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get both popular and trending movies
            List<MovieDto> popularMovies = tmdbMovieService.getPopularMovies(page);
            List<MovieDto> trendingMovies = tmdbMovieService.getTrendingMovies(page);
            
            // Check if we got any results from TMDB
            if (popularMovies.isEmpty() && trendingMovies.isEmpty()) {
                // Fallback to sample data if TMDB API fails
                response.put("success", true);
                response.put("page", page);
                response.put("results", createSampleMovies());
                response.put("total_results", 8);
                response.put("popular_count", 5);
                response.put("trending_count", 3);
                response.put("message", "Using sample data (TMDB API key not configured)");
                response.put("note", "To get real TMDB data, set TMDB_API_KEY environment variable");
                
                return ResponseEntity.ok(response);
            }
            
            // Combine and remove duplicates (based on movie ID)
            Map<Long, MovieDto> uniqueMovies = new HashMap<>();
            
            // Add popular movies first
            for (MovieDto movie : popularMovies) {
                uniqueMovies.put(movie.getId(), movie);
            }
            
            // Add trending movies (will override if same ID)
            for (MovieDto movie : trendingMovies) {
                uniqueMovies.put(movie.getId(), movie);
            }
            
            List<MovieDto> allMovies = List.copyOf(uniqueMovies.values());
            
            response.put("success", true);
            response.put("page", page);
            response.put("results", allMovies);
            response.put("total_results", allMovies.size());
            response.put("popular_count", popularMovies.size());
            response.put("trending_count", trendingMovies.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch movies: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Create sample movies for fallback
     */
    private List<MovieDto> createSampleMovies() {
        List<MovieDto> movies = new ArrayList<>();
        
        // Popular movies with real TMDB IDs
        movies.add(new MovieDto(603L, "The Matrix", 
            "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", 
            "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", 
            "https://vidsrc.to/embed/movie/603"));
        
        movies.add(new MovieDto(155L, "The Dark Knight", 
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", 
            "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", 
            "https://vidsrc.to/embed/movie/155"));
        
        movies.add(new MovieDto(27205L, "Inception", 
            "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception.", 
            "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", 
            "https://vidsrc.to/embed/movie/27205"));
        
        movies.add(new MovieDto(680L, "Pulp Fiction", 
            "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.", 
            "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", 
            "https://vidsrc.to/embed/movie/680"));
        
        movies.add(new MovieDto(550L, "Fight Club", 
            "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.", 
            "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", 
            "https://vidsrc.to/embed/movie/550"));
        
        movies.add(new MovieDto(13L, "Forrest Gump", 
            "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.", 
            "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", 
            "https://vidsrc.to/embed/movie/13"));
        
        movies.add(new MovieDto(238L, "The Godfather", 
            "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.", 
            "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", 
            "https://vidsrc.to/embed/movie/238"));
        
        movies.add(new MovieDto(278L, "The Shawshank Redemption", 
            "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.", 
            "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", 
            "https://vidsrc.to/embed/movie/278"));
        
        return movies;
    }
    
    /**
     * Get movie details by TMDB ID
     * GET /api/external-movies/{tmdbId}
     */
    @GetMapping("/{tmdbId}")
    public ResponseEntity<Map<String, Object>> getMovieById(@PathVariable Long tmdbId) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // For now, we'll search for the movie by ID
            // In a full implementation, you'd want to use TMDB's /movie/{id} endpoint
            List<MovieDto> movies = tmdbMovieService.searchMovies(tmdbId.toString(), 1);
            
            MovieDto movie = movies.stream()
                    .filter(m -> m.getId().equals(tmdbId))
                    .findFirst()
                    .orElse(null);
            
            if (movie != null) {
                response.put("success", true);
                response.put("movie", movie);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Movie not found with TMDB ID: " + tmdbId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch movie: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get video URL for a movie
     * GET /api/external-movies/{tmdbId}/video
     */
    @GetMapping("/{tmdbId}/video")
    public ResponseEntity<Map<String, Object>> getMovieVideoUrl(@PathVariable Long tmdbId) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            Map<String, Object> videoResult = videoUrlService.getVideoUrl(tmdbId.toString());
            return ResponseEntity.ok(videoResult);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to get video URL: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 