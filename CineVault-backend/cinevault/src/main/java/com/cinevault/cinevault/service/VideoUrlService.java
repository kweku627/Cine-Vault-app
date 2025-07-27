package com.cinevault.cinevault.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VideoUrlService {
    
    private static final Logger logger = LoggerFactory.getLogger(VideoUrlService.class);
    
    @Autowired
    private VideoScraperService videoScraperService;
    
    // Simple in-memory cache (for production, use Redis or similar)
    private final Map<String, CachedVideoUrl> videoUrlCache = new ConcurrentHashMap<>();
    
    // Cache expiration time (5 minutes)
    private static final long CACHE_EXPIRATION_TIME = 5 * 60 * 1000;
    
    /**
     * Get video URL for a movie with caching
     */
    public Map<String, Object> getVideoUrl(String movieId) {
        try {
            // Check cache first
            CachedVideoUrl cached = videoUrlCache.get(movieId);
            if (cached != null && !cached.isExpired()) {
                logger.info("Returning cached video URL for movie ID: {}", movieId);
                return createSuccessResponse(movieId, cached.getVideoUrl(), "cached");
            }
            
            // Extract video URL
            String videoUrl = videoScraperService.extractVideoUrl(movieId);
            
            if (videoUrl != null) {
                // Cache the result
                videoUrlCache.put(movieId, new CachedVideoUrl(videoUrl));
                
                logger.info("Successfully extracted and cached video URL for movie ID {}: {}", movieId, videoUrl);
                return createSuccessResponse(movieId, videoUrl, "direct");
            } else {
                // Fallback to embed URL
                String embedUrl = videoScraperService.getEmbedUrl(movieId);
                videoUrlCache.put(movieId, new CachedVideoUrl(embedUrl));
                
                logger.warn("Direct video URL not found for movie ID {}, using embed URL: {}", movieId, embedUrl);
                return createSuccessResponse(movieId, embedUrl, "embed", "Direct video URL not found, using embed URL");
            }
            
        } catch (Exception e) {
            logger.error("Error getting video URL for movie ID {}: {}", movieId, e.getMessage());
            return createErrorResponse("Failed to get video URL: " + e.getMessage());
        }
    }
    
    /**
     * Get embed URL for a movie
     */
    public Map<String, Object> getEmbedUrl(String movieId) {
        try {
            String embedUrl = videoScraperService.getEmbedUrl(movieId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("movieId", movieId);
            response.put("videoUrl", embedUrl);
            response.put("method", "embed");
            
            logger.info("Generated embed URL for movie ID {}: {}", movieId, embedUrl);
            return response;
            
        } catch (Exception e) {
            logger.error("Error generating embed URL for movie ID {}: {}", movieId, e.getMessage());
            return createErrorResponse("Failed to generate embed URL: " + e.getMessage());
        }
    }
    
    /**
     * Clear cache for a specific movie
     */
    public void clearCache(String movieId) {
        videoUrlCache.remove(movieId);
        logger.info("Cleared cache for movie ID: {}", movieId);
    }
    
    /**
     * Clear all cache
     */
    public void clearAllCache() {
        videoUrlCache.clear();
        logger.info("Cleared all video URL cache");
    }
    
    /**
     * Get cache statistics
     */
    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("cacheSize", videoUrlCache.size());
        stats.put("cachedMovies", videoUrlCache.keySet());
        return stats;
    }
    
    /**
     * Create success response
     */
    private Map<String, Object> createSuccessResponse(String movieId, String videoUrl, String method) {
        return createSuccessResponse(movieId, videoUrl, method, null);
    }
    
    /**
     * Create success response with message
     */
    private Map<String, Object> createSuccessResponse(String movieId, String videoUrl, String method, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("movieId", movieId);
        response.put("videoUrl", videoUrl);
        response.put("method", method);
        if (message != null) {
            response.put("message", message);
        }
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * Create error response
     */
    private Map<String, Object> createErrorResponse(String error) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", error);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * Inner class for caching video URLs
     */
    private static class CachedVideoUrl {
        private final String videoUrl;
        private final long timestamp;
        
        public CachedVideoUrl(String videoUrl) {
            this.videoUrl = videoUrl;
            this.timestamp = System.currentTimeMillis();
        }
        
        public String getVideoUrl() {
            return videoUrl;
        }
        
        public boolean isExpired() {
            return System.currentTimeMillis() - timestamp > CACHE_EXPIRATION_TIME;
        }
    }
} 