package com.cinevault.cinevault.service;

import com.cinevault.cinevault.model.Movie;
import com.cinevault.cinevault.model.Series;
import com.cinevault.cinevault.model.Episode;
import com.cinevault.cinevault.repository.MovieRepository;
import com.cinevault.cinevault.repository.SeriesRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class VideoEmbedService {
    
    private static final String VIDSRC_BASE_URL = "https://vidsrc.to/embed";
    private static final String MOVIE_EMBED_PATH = "/movie";
    private static final String TV_EMBED_PATH = "/tv";
    
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;
    
    public VideoEmbedService(MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }
    
    /**
     * Generate embed URL for a movie by TMDB ID
     * @param tmdbId The TMDB movie ID
     * @return Optional containing the embed URL if movie exists
     */
    public Optional<String> generateMovieEmbedUrl(Long tmdbId) {
        Optional<Movie> movie = movieRepository.findByMovieId(tmdbId);
        if (movie.isPresent()) {
            String embedUrl = VIDSRC_BASE_URL + MOVIE_EMBED_PATH + "/" + tmdbId;
            return Optional.of(embedUrl);
        }
        return Optional.empty();
    }
    
    /**
     * Generate embed URL for a TV series by TMDB ID
     * @param tmdbId The TMDB series ID
     * @return Optional containing the embed URL if series exists
     */
    public Optional<String> generateSeriesEmbedUrl(Long tmdbId) {
        Optional<Series> series = seriesRepository.findBySeriesId(tmdbId);
        if (series.isPresent()) {
            String embedUrl = VIDSRC_BASE_URL + TV_EMBED_PATH + "/" + tmdbId;
            return Optional.of(embedUrl);
        }
        return Optional.empty();
    }
    
    /**
     * Generate embed URL for a specific TV episode
     * @param tmdbId The TMDB series ID
     * @param seasonNumber The season number
     * @param episodeNumber The episode number
     * @return Optional containing the embed URL if episode exists
     */
    public Optional<String> generateEpisodeEmbedUrl(Long tmdbId, Integer seasonNumber, Integer episodeNumber) {
        Optional<Series> series = seriesRepository.findBySeriesId(tmdbId);
        if (series.isPresent()) {
            Series seriesEntity = series.get();
            Episode episode = seriesEntity.findEpisode(seasonNumber, episodeNumber);
            
            if (episode != null) {
                String embedUrl = VIDSRC_BASE_URL + TV_EMBED_PATH + "/" + tmdbId + "/" + seasonNumber + "/" + episodeNumber;
                return Optional.of(embedUrl);
            }
        }
        return Optional.empty();
    }
    
    /**
     * Generate embed URL for a specific TV episode with validation
     * @param tmdbId The TMDB series ID
     * @param seasonNumber The season number
     * @param episodeNumber The episode number
     * @return Optional containing the embed URL if episode exists and is valid
     */
    public Optional<String> generateEpisodeEmbedUrlWithValidation(Long tmdbId, Integer seasonNumber, Integer episodeNumber) {
        if (tmdbId == null || seasonNumber == null || episodeNumber == null) {
            return Optional.empty();
        }
        
        if (seasonNumber <= 0 || episodeNumber <= 0) {
            return Optional.empty();
        }
        
        return generateEpisodeEmbedUrl(tmdbId, seasonNumber, episodeNumber);
    }
    
    /**
     * Check if a movie exists by TMDB ID
     * @param tmdbId The TMDB movie ID
     * @return true if movie exists, false otherwise
     */
    public boolean movieExists(Long tmdbId) {
        return movieRepository.findByMovieId(tmdbId).isPresent();
    }
    
    /**
     * Check if a series exists by TMDB ID
     * @param tmdbId The TMDB series ID
     * @return true if series exists, false otherwise
     */
    public boolean seriesExists(Long tmdbId) {
        return seriesRepository.findBySeriesId(tmdbId).isPresent();
    }
    
    /**
     * Check if a specific episode exists
     * @param tmdbId The TMDB series ID
     * @param seasonNumber The season number
     * @param episodeNumber The episode number
     * @return true if episode exists, false otherwise
     */
    public boolean episodeExists(Long tmdbId, Integer seasonNumber, Integer episodeNumber) {
        Optional<Series> series = seriesRepository.findBySeriesId(tmdbId);
        if (series.isPresent()) {
            Episode episode = series.get().findEpisode(seasonNumber, episodeNumber);
            return episode != null;
        }
        return false;
    }
    
    /**
     * Get episode information for validation
     * @param tmdbId The TMDB series ID
     * @param seasonNumber The season number
     * @param episodeNumber The episode number
     * @return Optional containing episode info if exists
     */
    public Optional<EpisodeInfo> getEpisodeInfo(Long tmdbId, Integer seasonNumber, Integer episodeNumber) {
        Optional<Series> series = seriesRepository.findBySeriesId(tmdbId);
        if (series.isPresent()) {
            Series seriesEntity = series.get();
            Episode episode = seriesEntity.findEpisode(seasonNumber, episodeNumber);
            
            if (episode != null) {
                EpisodeInfo info = new EpisodeInfo();
                info.setSeriesId(tmdbId);
                info.setSeriesName(seriesEntity.getName());
                info.setSeasonNumber(seasonNumber);
                info.setEpisodeNumber(episodeNumber);
                info.setEpisodeTitle(episode.getTitle());
                info.setEpisodeOverview(episode.getOverview());
                info.setEmbedUrl(VIDSRC_BASE_URL + TV_EMBED_PATH + "/" + tmdbId + "/" + seasonNumber + "/" + episodeNumber);
                
                return Optional.of(info);
            }
        }
        return Optional.empty();
    }
    
    /**
     * Inner class to hold episode information
     */
    public static class EpisodeInfo {
        private Long seriesId;
        private String seriesName;
        private Integer seasonNumber;
        private Integer episodeNumber;
        private String episodeTitle;
        private String episodeOverview;
        private String embedUrl;
        
        // Getters and Setters
        public Long getSeriesId() { return seriesId; }
        public void setSeriesId(Long seriesId) { this.seriesId = seriesId; }
        
        public String getSeriesName() { return seriesName; }
        public void setSeriesName(String seriesName) { this.seriesName = seriesName; }
        
        public Integer getSeasonNumber() { return seasonNumber; }
        public void setSeasonNumber(Integer seasonNumber) { this.seasonNumber = seasonNumber; }
        
        public Integer getEpisodeNumber() { return episodeNumber; }
        public void setEpisodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; }
        
        public String getEpisodeTitle() { return episodeTitle; }
        public void setEpisodeTitle(String episodeTitle) { this.episodeTitle = episodeTitle; }
        
        public String getEpisodeOverview() { return episodeOverview; }
        public void setEpisodeOverview(String episodeOverview) { this.episodeOverview = episodeOverview; }
        
        public String getEmbedUrl() { return embedUrl; }
        public void setEmbedUrl(String embedUrl) { this.embedUrl = embedUrl; }
    }
} 