package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.dto.MovieDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/test-movies")
@CrossOrigin(origins = "*")
public class TestMovieController {
    
    /**
     * Get sample movies for testing (no TMDB API key required)
     * GET /api/test-movies
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getSampleMovies() {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<MovieDto> movies = createSampleMovies();
            
            response.put("success", true);
            response.put("page", 1);
            response.put("results", movies);
            response.put("total_results", movies.size());
            response.put("message", "Sample movies for testing (no TMDB API key required)");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch sample movies: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get popular sample movies
     * GET /api/test-movies/popular
     */
    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularSampleMovies() {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<MovieDto> movies = createPopularSampleMovies();
            
            response.put("success", true);
            response.put("page", 1);
            response.put("results", movies);
            response.put("total_results", movies.size());
            response.put("message", "Popular sample movies for testing");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch popular sample movies: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Search sample movies
     * GET /api/test-movies/search?query={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchSampleMovies(@RequestParam String query) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Search query is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            List<MovieDto> allMovies = createSampleMovies();
            List<MovieDto> filteredMovies = new ArrayList<>();
            
            String searchQuery = query.toLowerCase().trim();
            
            for (MovieDto movie : allMovies) {
                if (movie.getTitle().toLowerCase().contains(searchQuery) ||
                    movie.getOverview().toLowerCase().contains(searchQuery)) {
                    filteredMovies.add(movie);
                }
            }
            
            response.put("success", true);
            response.put("query", query);
            response.put("page", 1);
            response.put("results", filteredMovies);
            response.put("total_results", filteredMovies.size());
            response.put("message", "Search results from sample movies");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to search sample movies: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Create sample movies for testing
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
     * Create popular sample movies
     */
    private List<MovieDto> createPopularSampleMovies() {
        List<MovieDto> movies = createSampleMovies();
        // Return first 5 movies as "popular"
        return movies.subList(0, Math.min(5, movies.size()));
    }
} 