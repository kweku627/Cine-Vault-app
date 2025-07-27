package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.dto.SeriesDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/test-series")
@CrossOrigin(origins = "*")
public class TestSeriesController {
    
    /**
     * Get sample series for testing (no TMDB API key required)
     * GET /api/test-series
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getSampleSeries() {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<SeriesDto> series = createSampleSeries();
            
            response.put("success", true);
            response.put("page", 1);
            response.put("results", series);
            response.put("total_results", series.size());
            response.put("message", "Sample series for testing (no TMDB API key required)");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch sample series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get popular sample series
     * GET /api/test-series/popular
     */
    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularSampleSeries() {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<SeriesDto> series = createPopularSampleSeries();
            
            response.put("success", true);
            response.put("page", 1);
            response.put("results", series);
            response.put("total_results", series.size());
            response.put("message", "Popular sample series for testing");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch popular sample series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Search sample series
     * GET /api/test-series/search?query={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchSampleSeries(@RequestParam String query) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Search query is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            List<SeriesDto> allSeries = createSampleSeries();
            List<SeriesDto> filteredSeries = new ArrayList<>();
            
            String searchQuery = query.toLowerCase().trim();
            
            for (SeriesDto series : allSeries) {
                if (series.getName().toLowerCase().contains(searchQuery) ||
                    series.getOverview().toLowerCase().contains(searchQuery)) {
                    filteredSeries.add(series);
                }
            }
            
            response.put("success", true);
            response.put("query", query);
            response.put("page", 1);
            response.put("results", filteredSeries);
            response.put("total_results", filteredSeries.size());
            response.put("message", "Search results from sample series");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to search sample series: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Create sample series for testing
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
    
    /**
     * Create popular sample series
     */
    private List<SeriesDto> createPopularSampleSeries() {
        List<SeriesDto> series = createSampleSeries();
        // Return first 5 series as "popular"
        return series.subList(0, Math.min(5, series.size()));
    }
} 