package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.dto.SeriesDto;
import com.cinevault.cinevault.service.TmdbSeriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/external-series")
@CrossOrigin(origins = "*")
public class ExternalSeriesController {
    
    private final TmdbSeriesService tmdbSeriesService;
    
    public ExternalSeriesController(TmdbSeriesService tmdbSeriesService) {
        this.tmdbSeriesService = tmdbSeriesService;
    }
    
    /**
     * Get popular TV series from TMDB
     * GET /api/external-series/popular
     */
    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularSeries(
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<SeriesDto> series = tmdbSeriesService.getPopularSeries(page);
            
            // Check if we got any results from TMDB
            if (series.isEmpty()) {
                // Fallback to sample data if TMDB API fails
                List<SeriesDto> sampleSeries = createSampleSeries().subList(0, 5); // First 5 series
                response.put("success", true);
                response.put("page", page);
                response.put("results", sampleSeries);
                response.put("total_results", sampleSeries.size());
                response.put("message", "Using sample data (TMDB API key not configured)");
                response.put("note", "To get real TMDB data, set TMDB_API_KEY environment variable");
                
                return ResponseEntity.ok(response);
            }
            
            response.put("success", true);
            response.put("page", page);
            response.put("results", series);
            response.put("total_results", series.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch popular series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get trending TV series from TMDB
     * GET /api/external-series/trending
     */
    @GetMapping("/trending")
    public ResponseEntity<Map<String, Object>> getTrendingSeries(
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<SeriesDto> series = tmdbSeriesService.getTrendingSeries(page);
            
            // Check if we got any results from TMDB
            if (series.isEmpty()) {
                // Fallback to sample data if TMDB API fails
                List<SeriesDto> sampleSeries = createSampleSeries().subList(5, 8); // Last 3 series
                response.put("success", true);
                response.put("page", page);
                response.put("results", sampleSeries);
                response.put("total_results", sampleSeries.size());
                response.put("message", "Using sample data (TMDB API key not configured)");
                response.put("note", "To get real TMDB data, set TMDB_API_KEY environment variable");
                
                return ResponseEntity.ok(response);
            }
            
            response.put("success", true);
            response.put("page", page);
            response.put("results", series);
            response.put("total_results", series.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch trending series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Search TV series by title
     * GET /api/external-series/search?query={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchSeries(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Search query is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            List<SeriesDto> series = tmdbSeriesService.searchSeries(query.trim(), page);
            
            response.put("success", true);
            response.put("query", query);
            response.put("page", page);
            response.put("results", series);
            response.put("total_results", series.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to search series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get TV series by genre
     * GET /api/external-series/genre/{genreId}
     */
    @GetMapping("/genre/{genreId}")
    public ResponseEntity<Map<String, Object>> getSeriesByGenre(
            @PathVariable int genreId,
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<SeriesDto> series = tmdbSeriesService.getSeriesByGenre(genreId, page);
            
            response.put("success", true);
            response.put("genre_id", genreId);
            response.put("page", page);
            response.put("results", series);
            response.put("total_results", series.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch series by genre: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get all series (combines popular and trending)
     * GET /api/external-series
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSeries(
            @RequestParam(defaultValue = "1") int page) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get both popular and trending series
            List<SeriesDto> popularSeries = tmdbSeriesService.getPopularSeries(page);
            List<SeriesDto> trendingSeries = tmdbSeriesService.getTrendingSeries(page);
            
            // Check if we got any results from TMDB
            if (popularSeries.isEmpty() && trendingSeries.isEmpty()) {
                // Fallback to sample data if TMDB API fails
                response.put("success", true);
                response.put("page", page);
                response.put("results", createSampleSeries());
                response.put("total_results", 8);
                response.put("popular_count", 5);
                response.put("trending_count", 3);
                response.put("message", "Using sample data (TMDB API key not configured)");
                response.put("note", "To get real TMDB data, set TMDB_API_KEY environment variable");
                
                return ResponseEntity.ok(response);
            }
            
            // Combine and remove duplicates (based on series ID)
            Map<Long, SeriesDto> uniqueSeries = new HashMap<>();
            
            // Add popular series first
            for (SeriesDto series : popularSeries) {
                uniqueSeries.put(series.getId(), series);
            }
            
            // Add trending series (will override if same ID)
            for (SeriesDto series : trendingSeries) {
                uniqueSeries.put(series.getId(), series);
            }
            
            List<SeriesDto> allSeries = List.copyOf(uniqueSeries.values());
            
            response.put("success", true);
            response.put("page", page);
            response.put("results", allSeries);
            response.put("total_results", allSeries.size());
            response.put("popular_count", popularSeries.size());
            response.put("trending_count", trendingSeries.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get series details by TMDB ID
     * GET /api/external-series/{tmdbId}
     */
    @GetMapping("/{tmdbId}")
    public ResponseEntity<Map<String, Object>> getSeriesById(@PathVariable Long tmdbId) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Use the new detailed fetch method
            SeriesDto seriesDto = tmdbSeriesService.getSeriesDetails(tmdbId);
            
            if (seriesDto != null) {
                response.put("success", true);
                response.put("series", seriesDto);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Series not found with TMDB ID: " + tmdbId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Create sample series for fallback
     */
    private List<SeriesDto> createSampleSeries() {
        List<SeriesDto> series = new ArrayList<>();
        
        // Popular TV series with real TMDB IDs
        series.add(new SeriesDto(1399L, "Game of Thrones", 
            "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.", 
            "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg", 
            "https://vidsrc.to/embed/tv/1399"));
        
        series.add(new SeriesDto(1396L, "Breaking Bad", 
            "When an unassuming high school chemistry teacher discovers he has a rare form of lung cancer, he decides to team up with a former student and secure his family's financial future as they partner to cook and sell the world's purest crystal meth.", 
            "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", 
            "https://vidsrc.to/embed/tv/1396"));
        
        series.add(new SeriesDto(1398L, "The Walking Dead", 
            "Sheriff's deputy Rick Grimes awakens from a coma to find a post-apocalyptic world dominated by flesh-eating zombies. He sets out to find his family and encounters many other survivors along the way.", 
            "/w21lgYt9Ge73c9uALco9pElK0Hs.jpg", 
            "https://vidsrc.to/embed/tv/1398"));
        
        series.add(new SeriesDto(1390L, "The Big Bang Theory", 
            "Leonard Hofstadter and Sheldon Cooper are both brilliant physicists working at Cal Tech in Pasadena, California. They are colleagues, best friends, and roommates, although in all capacities their relationship is always tested primarily by Sheldon's regimented, deeply eccentric, and non-conventional ways.", 
            "/ooBGRQBdbGzBxAVfExRx8vH7zrm.jpg", 
            "https://vidsrc.to/embed/tv/1390"));
        
        series.add(new SeriesDto(1391L, "Friends", 
            "The misadventures of a group of friends as they navigate the pitfalls of work, life and love in Manhattan.", 
            "/f496cm9enuEsZkSPzCwnTESEK5s.jpg", 
            "https://vidsrc.to/embed/tv/1391"));
        
        series.add(new SeriesDto(1392L, "The Office", 
            "The everyday lives of office employees in the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company.", 
            "/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg", 
            "https://vidsrc.to/embed/tv/1392"));
        
        series.add(new SeriesDto(1393L, "Stranger Things", 
            "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.", 
            "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", 
            "https://vidsrc.to/embed/tv/1393"));
        
        series.add(new SeriesDto(1394L, "The Crown", 
            "The story of Queen Elizabeth II and the events that shaped the second half of the twentieth century.", 
            "/7k7oKzJmciHmJzHjzHjzHjzHjzHjz.jpg", 
            "https://vidsrc.to/embed/tv/1394"));
        
        return series;
    }
} 