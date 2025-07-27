package com.cinevault.cinevault.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class TmdbTrailerService {
    
    @Value("${tmdb.api.key:your_tmdb_api_key_here}")
    private String tmdbApiKey;
    
    @Value("${tmdb.base.url:https://api.themoviedb.org/3}")
    private String tmdbBaseUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public TmdbTrailerService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Fetch trailers for a movie from TMDB API
     */
    public List<Map<String, Object>> getMovieTrailers(Long tmdbMovieId) {
        if (tmdbApiKey.equals("your_tmdb_api_key_here")) {
            return getSampleMovieTrailers();
        }
        
        try {
            String url = String.format("%s/movie/%d/videos?api_key=%s", tmdbBaseUrl, tmdbMovieId, tmdbApiKey);
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null) {
                JsonNode rootNode = objectMapper.readTree(response);
                JsonNode resultsNode = rootNode.get("results");
                
                List<Map<String, Object>> trailers = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode trailerNode : resultsNode) {
                        String site = trailerNode.get("site") != null ? trailerNode.get("site").asText() : "";
                        String type = trailerNode.get("type") != null ? trailerNode.get("type").asText() : "";
                        
                        // Only include YouTube trailers
                        if ("YouTube".equals(site) && "Trailer".equals(type)) {
                            Map<String, Object> trailer = new HashMap<>();
                            trailer.put("id", trailerNode.get("key") != null ? trailerNode.get("key").asText() : "");
                            trailer.put("title", trailerNode.get("name") != null ? trailerNode.get("name").asText() : "");
                            trailer.put("videoUrl", generateYouTubeUrl(trailerNode.get("key") != null ? trailerNode.get("key").asText() : ""));
                            trailer.put("thumbnailUrl", generateYouTubeThumbnail(trailerNode.get("key") != null ? trailerNode.get("key").asText() : ""));
                            trailer.put("site", site);
                            trailer.put("type", type);
                            trailer.put("size", trailerNode.get("size") != null ? trailerNode.get("size").asInt() : 0);
                            trailer.put("official", trailerNode.get("official") != null ? trailerNode.get("official").asBoolean() : false);
                            
                            trailers.add(trailer);
                        }
                    }
                }
                
                return trailers;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Fetch trailers for a TV series from TMDB API
     */
    public List<Map<String, Object>> getSeriesTrailers(Long tmdbSeriesId) {
        if (tmdbApiKey.equals("your_tmdb_api_key_here")) {
            return getSampleSeriesTrailers();
        }
        
        try {
            String url = String.format("%s/tv/%d/videos?api_key=%s", tmdbBaseUrl, tmdbSeriesId, tmdbApiKey);
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null) {
                JsonNode rootNode = objectMapper.readTree(response);
                JsonNode resultsNode = rootNode.get("results");
                
                List<Map<String, Object>> trailers = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode trailerNode : resultsNode) {
                        String site = trailerNode.get("site") != null ? trailerNode.get("site").asText() : "";
                        String type = trailerNode.get("type") != null ? trailerNode.get("type").asText() : "";
                        
                        // Only include YouTube trailers
                        if ("YouTube".equals(site) && "Trailer".equals(type)) {
                            Map<String, Object> trailer = new HashMap<>();
                            trailer.put("id", trailerNode.get("key") != null ? trailerNode.get("key").asText() : "");
                            trailer.put("title", trailerNode.get("name") != null ? trailerNode.get("name").asText() : "");
                            trailer.put("videoUrl", generateYouTubeUrl(trailerNode.get("key") != null ? trailerNode.get("key").asText() : ""));
                            trailer.put("thumbnailUrl", generateYouTubeThumbnail(trailerNode.get("key") != null ? trailerNode.get("key").asText() : ""));
                            trailer.put("site", site);
                            trailer.put("type", type);
                            trailer.put("size", trailerNode.get("size") != null ? trailerNode.get("size").asInt() : 0);
                            trailer.put("official", trailerNode.get("official") != null ? trailerNode.get("official").asBoolean() : false);
                            
                            trailers.add(trailer);
                        }
                    }
                }
                
                return trailers;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Generate YouTube embed URL
     */
    private String generateYouTubeUrl(String videoKey) {
        if (videoKey == null || videoKey.isEmpty()) {
            return "";
        }
        return String.format("https://www.youtube.com/embed/%s", videoKey);
    }
    
    /**
     * Generate YouTube thumbnail URL
     */
    private String generateYouTubeThumbnail(String videoKey) {
        if (videoKey == null || videoKey.isEmpty()) {
            return "";
        }
        return String.format("https://img.youtube.com/vi/%s/maxresdefault.jpg", videoKey);
    }
    
    /**
     * Get sample movie trailers for testing (no API key required)
     */
    private List<Map<String, Object>> getSampleMovieTrailers() {
        List<Map<String, Object>> trailers = new ArrayList<>();
        
        Map<String, Object> trailer1 = new HashMap<>();
        trailer1.put("id", "m8e-FF8MsqU");
        trailer1.put("title", "The Matrix - Official Trailer");
        trailer1.put("videoUrl", "https://www.youtube.com/embed/m8e-FF8MsqU");
        trailer1.put("thumbnailUrl", "https://img.youtube.com/vi/m8e-FF8MsqU/maxresdefault.jpg");
        trailer1.put("site", "YouTube");
        trailer1.put("type", "Trailer");
        trailer1.put("size", 1080);
        trailer1.put("official", true);
        trailers.add(trailer1);
        
        Map<String, Object> trailer2 = new HashMap<>();
        trailer2.put("id", "vKQi3bBA1y8");
        trailer2.put("title", "The Matrix Reloaded - Official Trailer");
        trailer2.put("videoUrl", "https://www.youtube.com/embed/vKQi3bBA1y8");
        trailer2.put("thumbnailUrl", "https://img.youtube.com/vi/vKQi3bBA1y8/maxresdefault.jpg");
        trailer2.put("site", "YouTube");
        trailer2.put("type", "Trailer");
        trailer2.put("size", 1080);
        trailer2.put("official", true);
        trailers.add(trailer2);
        
        return trailers;
    }
    
    /**
     * Get sample series trailers for testing (no API key required)
     */
    private List<Map<String, Object>> getSampleSeriesTrailers() {
        List<Map<String, Object>> trailers = new ArrayList<>();
        
        Map<String, Object> trailer1 = new HashMap<>();
        trailer1.put("id", "HhesaQXLuRY");
        trailer1.put("title", "Stranger Things - Official Trailer");
        trailer1.put("videoUrl", "https://www.youtube.com/embed/HhesaQXLuRY");
        trailer1.put("thumbnailUrl", "https://img.youtube.com/vi/HhesaQXLuRY/maxresdefault.jpg");
        trailer1.put("site", "YouTube");
        trailer1.put("type", "Trailer");
        trailer1.put("size", 1080);
        trailer1.put("official", true);
        trailers.add(trailer1);
        
        return trailers;
    }
} 