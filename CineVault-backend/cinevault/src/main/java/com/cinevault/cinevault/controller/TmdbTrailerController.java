package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.service.TmdbTrailerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tmdb-trailers")
@CrossOrigin(origins = "*")
public class TmdbTrailerController {

    @Autowired
    private TmdbTrailerService tmdbTrailerService;

    /**
     * Get trailers for a movie by TMDB ID
     * GET /api/tmdb-trailers/movie/{tmdbMovieId}
     */
    @GetMapping("/movie/{tmdbMovieId}")
    public ResponseEntity<Map<String, Object>> getMovieTrailers(@PathVariable Long tmdbMovieId) {
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbMovieId == null || tmdbMovieId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB Movie ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            List<Map<String, Object>> trailers = tmdbTrailerService.getMovieTrailers(tmdbMovieId);
            
            response.put("success", true);
            response.put("movieId", tmdbMovieId);
            response.put("trailers", trailers);
            response.put("count", trailers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch movie trailers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get trailers for a TV series by TMDB ID
     * GET /api/tmdb-trailers/series/{tmdbSeriesId}
     */
    @GetMapping("/series/{tmdbSeriesId}")
    public ResponseEntity<Map<String, Object>> getSeriesTrailers(@PathVariable Long tmdbSeriesId) {
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbSeriesId == null || tmdbSeriesId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB Series ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            List<Map<String, Object>> trailers = tmdbTrailerService.getSeriesTrailers(tmdbSeriesId);
            
            response.put("success", true);
            response.put("seriesId", tmdbSeriesId);
            response.put("trailers", trailers);
            response.put("count", trailers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch series trailers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get sample trailers for testing (no API key required)
     * GET /api/tmdb-trailers/sample/movie
     */
    @GetMapping("/sample/movie")
    public ResponseEntity<Map<String, Object>> getSampleMovieTrailers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Map<String, Object>> trailers = tmdbTrailerService.getMovieTrailers(603L); // The Matrix
            
            response.put("success", true);
            response.put("message", "Sample movie trailers (no API key required)");
            response.put("trailers", trailers);
            response.put("count", trailers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch sample movie trailers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get sample trailers for testing (no API key required)
     * GET /api/tmdb-trailers/sample/series
     */
    @GetMapping("/sample/series")
    public ResponseEntity<Map<String, Object>> getSampleSeriesTrailers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Map<String, Object>> trailers = tmdbTrailerService.getSeriesTrailers(1399L); // Game of Thrones
            
            response.put("success", true);
            response.put("message", "Sample series trailers (no API key required)");
            response.put("trailers", trailers);
            response.put("count", trailers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to fetch sample series trailers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 