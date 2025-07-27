package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.service.VideoScraperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/scrape")
@CrossOrigin(origins = "*")
public class VideoScraperController {
    
    private static final Logger logger = LoggerFactory.getLogger(VideoScraperController.class);
    
    @Autowired
    private VideoScraperService videoScraperService;
    
    /**
     * Extract direct video URL for a movie
     */
    @GetMapping("/video/{movieId}")
    public ResponseEntity<?> getVideoUrl(@PathVariable String movieId) {
        try {
            logger.info("Received request to extract video URL for movie ID: {}", movieId);
            
            if (movieId == null || movieId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Movie ID is required"));
            }
            
            // Extract video URL
            String videoUrl = videoScraperService.extractVideoUrl(movieId);
            
            if (videoUrl != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("movieId", movieId);
                response.put("videoUrl", videoUrl);
                response.put("method", "direct");
                
                logger.info("Successfully extracted video URL for movie ID {}: {}", movieId, videoUrl);
                return ResponseEntity.ok(response);
            } else {
                // Fallback to embed URL
                String embedUrl = videoScraperService.getEmbedUrl(movieId);
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("movieId", movieId);
                response.put("videoUrl", embedUrl);
                response.put("method", "embed");
                response.put("message", "Direct video URL not found, using embed URL");
                
                logger.warn("Direct video URL not found for movie ID {}, using embed URL: {}", movieId, embedUrl);
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            logger.error("Error extracting video URL for movie ID {}: {}", movieId, e.getMessage());
            return ResponseEntity.status(500).body(createErrorResponse("Failed to extract video URL: " + e.getMessage()));
        }
    }
    
    /**
     * Extract video URL using Jsoup only
     */
    @GetMapping("/video/{movieId}/jsoup")
    public ResponseEntity<?> getVideoUrlWithJsoup(@PathVariable String movieId) {
        try {
            logger.info("Received request to extract video URL with Jsoup for movie ID: {}", movieId);
            
            if (movieId == null || movieId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Movie ID is required"));
            }
            
            String videoUrl = videoScraperService.extractVideoUrlWithJsoup(movieId);
            
            if (videoUrl != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("movieId", movieId);
                response.put("videoUrl", videoUrl);
                response.put("method", "jsoup");
                
                logger.info("Successfully extracted video URL with Jsoup for movie ID {}: {}", movieId, videoUrl);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.ok(createErrorResponse("No video URL found with Jsoup"));
            }
            
        } catch (Exception e) {
            logger.error("Error extracting video URL with Jsoup for movie ID {}: {}", movieId, e.getMessage());
            return ResponseEntity.status(500).body(createErrorResponse("Failed to extract video URL with Jsoup: " + e.getMessage()));
        }
    }
    

    
    /**
     * Get embed URL for a movie
     */
    @GetMapping("/embed/{movieId}")
    public ResponseEntity<?> getEmbedUrl(@PathVariable String movieId) {
        try {
            logger.info("Received request to get embed URL for movie ID: {}", movieId);
            
            if (movieId == null || movieId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Movie ID is required"));
            }
            
            String embedUrl = videoScraperService.getEmbedUrl(movieId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("movieId", movieId);
            response.put("embedUrl", embedUrl);
            
            logger.info("Successfully generated embed URL for movie ID {}: {}", movieId, embedUrl);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error generating embed URL for movie ID {}: {}", movieId, e.getMessage());
            return ResponseEntity.status(500).body(createErrorResponse("Failed to generate embed URL: " + e.getMessage()));
        }
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("service", "Video Scraper Service");
        response.put("status", "running");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Create error response
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
} 