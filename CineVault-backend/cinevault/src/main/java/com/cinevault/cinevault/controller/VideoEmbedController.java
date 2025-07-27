package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.service.VideoEmbedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/embed")
@CrossOrigin(origins = "*")
public class VideoEmbedController {
    
    private final VideoEmbedService videoEmbedService;
    
    public VideoEmbedController(VideoEmbedService videoEmbedService) {
        this.videoEmbedService = videoEmbedService;
    }
    
    /**
     * Generate embed URL for a movie
     * GET /embed/movie/{tmdbId}
     */
    @GetMapping("/movie/{tmdbId}")
    public ResponseEntity<Map<String, Object>> getMovieEmbedUrl(@PathVariable Long tmdbId) {
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        Optional<String> embedUrl = videoEmbedService.generateMovieEmbedUrl(tmdbId);
        
        if (embedUrl.isPresent()) {
            response.put("success", true);
            response.put("tmdbId", tmdbId);
            response.put("type", "movie");
            response.put("embedUrl", embedUrl.get());
            response.put("iframeUrl", embedUrl.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Movie not found with TMDB ID: " + tmdbId);
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Generate embed URL for a TV series
     * GET /embed/tv/{tmdbId}
     */
    @GetMapping("/tv/{tmdbId}")
    public ResponseEntity<Map<String, Object>> getSeriesEmbedUrl(@PathVariable Long tmdbId) {
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        Optional<String> embedUrl = videoEmbedService.generateSeriesEmbedUrl(tmdbId);
        
        if (embedUrl.isPresent()) {
            response.put("success", true);
            response.put("tmdbId", tmdbId);
            response.put("type", "series");
            response.put("embedUrl", embedUrl.get());
            response.put("iframeUrl", embedUrl.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Series not found with TMDB ID: " + tmdbId);
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Generate embed URL for a specific TV episode
     * GET /embed/tv/{tmdbId}/{season}/{episode}
     */
    @GetMapping("/tv/{tmdbId}/{season}/{episode}")
    public ResponseEntity<Map<String, Object>> getEpisodeEmbedUrl(
            @PathVariable Long tmdbId,
            @PathVariable Integer season,
            @PathVariable Integer episode) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0 || season == null || season <= 0 || episode == null || episode <= 0) {
            response.put("success", false);
            response.put("error", "Invalid parameters");
            return ResponseEntity.badRequest().body(response);
        }
        
        Optional<String> embedUrl = videoEmbedService.generateEpisodeEmbedUrlWithValidation(tmdbId, season, episode);
        
        if (embedUrl.isPresent()) {
            response.put("success", true);
            response.put("tmdbId", tmdbId);
            response.put("type", "episode");
            response.put("season", season);
            response.put("episode", episode);
            response.put("embedUrl", embedUrl.get());
            response.put("iframeUrl", embedUrl.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Episode not found: Series " + tmdbId + ", Season " + season + ", Episode " + episode);
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get detailed episode information with embed URL
     * GET /embed/tv/{tmdbId}/{season}/{episode}/info
     */
    @GetMapping("/tv/{tmdbId}/{season}/{episode}/info")
    public ResponseEntity<Map<String, Object>> getEpisodeInfo(
            @PathVariable Long tmdbId,
            @PathVariable Integer season,
            @PathVariable Integer episode) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0 || season == null || season <= 0 || episode == null || episode <= 0) {
            response.put("success", false);
            response.put("error", "Invalid parameters");
            return ResponseEntity.badRequest().body(response);
        }
        
        Optional<VideoEmbedService.EpisodeInfo> episodeInfo = videoEmbedService.getEpisodeInfo(tmdbId, season, episode);
        
        if (episodeInfo.isPresent()) {
            VideoEmbedService.EpisodeInfo info = episodeInfo.get();
            response.put("success", true);
            response.put("tmdbId", info.getSeriesId());
            response.put("seriesName", info.getSeriesName());
            response.put("season", info.getSeasonNumber());
            response.put("episode", info.getEpisodeNumber());
            response.put("episodeTitle", info.getEpisodeTitle());
            response.put("episodeOverview", info.getEpisodeOverview());
            response.put("embedUrl", info.getEmbedUrl());
            response.put("iframeUrl", info.getEmbedUrl());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Episode not found: Series " + tmdbId + ", Season " + season + ", Episode " + episode);
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Check if content exists
     * GET /embed/check/movie/{tmdbId}
     */
    @GetMapping("/check/movie/{tmdbId}")
    public ResponseEntity<Map<String, Object>> checkMovieExists(@PathVariable Long tmdbId) {
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean exists = videoEmbedService.movieExists(tmdbId);
        response.put("success", true);
        response.put("tmdbId", tmdbId);
        response.put("type", "movie");
        response.put("exists", exists);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Check if series exists
     * GET /embed/check/tv/{tmdbId}
     */
    @GetMapping("/check/tv/{tmdbId}")
    public ResponseEntity<Map<String, Object>> checkSeriesExists(@PathVariable Long tmdbId) {
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0) {
            response.put("success", false);
            response.put("error", "Invalid TMDB ID");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean exists = videoEmbedService.seriesExists(tmdbId);
        response.put("success", true);
        response.put("tmdbId", tmdbId);
        response.put("type", "series");
        response.put("exists", exists);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Check if episode exists
     * GET /embed/check/tv/{tmdbId}/{season}/{episode}
     */
    @GetMapping("/check/tv/{tmdbId}/{season}/{episode}")
    public ResponseEntity<Map<String, Object>> checkEpisodeExists(
            @PathVariable Long tmdbId,
            @PathVariable Integer season,
            @PathVariable Integer episode) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (tmdbId == null || tmdbId <= 0 || season == null || season <= 0 || episode == null || episode <= 0) {
            response.put("success", false);
            response.put("error", "Invalid parameters");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean exists = videoEmbedService.episodeExists(tmdbId, season, episode);
        response.put("success", true);
        response.put("tmdbId", tmdbId);
        response.put("type", "episode");
        response.put("season", season);
        response.put("episode", episode);
        response.put("exists", exists);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get iframe HTML for embedding
     * GET /embed/iframe/movie/{tmdbId}
     */
    @GetMapping(value = "/iframe/movie/{tmdbId}", produces = "text/html")
    public ResponseEntity<String> getMovieIframe(@PathVariable Long tmdbId) {
        if (tmdbId == null || tmdbId <= 0) {
            return ResponseEntity.badRequest().body("<p>Invalid TMDB ID</p>");
        }
        
        Optional<String> embedUrl = videoEmbedService.generateMovieEmbedUrl(tmdbId);
        
        if (embedUrl.isPresent()) {
            String iframeHtml = String.format(
                "<iframe src=\"%s\" width=\"100%%\" height=\"100%%\" frameborder=\"0\" allowfullscreen></iframe>",
                embedUrl.get()
            );
            return ResponseEntity.ok(iframeHtml);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get iframe HTML for TV series
     * GET /embed/iframe/tv/{tmdbId}
     */
    @GetMapping(value = "/iframe/tv/{tmdbId}", produces = "text/html")
    public ResponseEntity<String> getSeriesIframe(@PathVariable Long tmdbId) {
        if (tmdbId == null || tmdbId <= 0) {
            return ResponseEntity.badRequest().body("<p>Invalid TMDB ID</p>");
        }
        
        Optional<String> embedUrl = videoEmbedService.generateSeriesEmbedUrl(tmdbId);
        
        if (embedUrl.isPresent()) {
            String iframeHtml = String.format(
                "<iframe src=\"%s\" width=\"100%%\" height=\"100%%\" frameborder=\"0\" allowfullscreen></iframe>",
                embedUrl.get()
            );
            return ResponseEntity.ok(iframeHtml);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get iframe HTML for specific episode
     * GET /embed/iframe/tv/{tmdbId}/{season}/{episode}
     */
    @GetMapping(value = "/iframe/tv/{tmdbId}/{season}/{episode}", produces = "text/html")
    public ResponseEntity<String> getEpisodeIframe(
            @PathVariable Long tmdbId,
            @PathVariable Integer season,
            @PathVariable Integer episode) {
        
        if (tmdbId == null || tmdbId <= 0 || season == null || season <= 0 || episode == null || episode <= 0) {
            return ResponseEntity.badRequest().body("<p>Invalid parameters</p>");
        }
        
        Optional<String> embedUrl = videoEmbedService.generateEpisodeEmbedUrlWithValidation(tmdbId, season, episode);
        
        if (embedUrl.isPresent()) {
            String iframeHtml = String.format(
                "<iframe src=\"%s\" width=\"100%%\" height=\"100%%\" frameborder=\"0\" allowfullscreen></iframe>",
                embedUrl.get()
            );
            return ResponseEntity.ok(iframeHtml);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 