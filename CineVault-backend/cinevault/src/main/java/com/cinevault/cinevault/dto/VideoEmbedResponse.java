package com.cinevault.cinevault.dto;

import java.time.LocalDateTime;

public class VideoEmbedResponse {
    private boolean success;
    private String message;
    private Long tmdbId;
    private String type;
    private String embedUrl;
    private String iframeUrl;
    private Integer season;
    private Integer episode;
    private String seriesName;
    private String episodeTitle;
    private String episodeOverview;
    private LocalDateTime timestamp;
    private String error;

    public VideoEmbedResponse() {
        this.timestamp = LocalDateTime.now();
    }

    // Success response constructor
    public VideoEmbedResponse(boolean success, String message, Long tmdbId, String type, String embedUrl) {
        this();
        this.success = success;
        this.message = message;
        this.tmdbId = tmdbId;
        this.type = type;
        this.embedUrl = embedUrl;
        this.iframeUrl = embedUrl;
    }

    // Error response constructor
    public VideoEmbedResponse(boolean success, String error) {
        this();
        this.success = success;
        this.error = error;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getTmdbId() { return tmdbId; }
    public void setTmdbId(Long tmdbId) { this.tmdbId = tmdbId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEmbedUrl() { return embedUrl; }
    public void setEmbedUrl(String embedUrl) { this.embedUrl = embedUrl; }

    public String getIframeUrl() { return iframeUrl; }
    public void setIframeUrl(String iframeUrl) { this.iframeUrl = iframeUrl; }

    public Integer getSeason() { return season; }
    public void setSeason(Integer season) { this.season = season; }

    public Integer getEpisode() { return episode; }
    public void setEpisode(Integer episode) { this.episode = episode; }

    public String getSeriesName() { return seriesName; }
    public void setSeriesName(String seriesName) { this.seriesName = seriesName; }

    public String getEpisodeTitle() { return episodeTitle; }
    public void setEpisodeTitle(String episodeTitle) { this.episodeTitle = episodeTitle; }

    public String getEpisodeOverview() { return episodeOverview; }
    public void setEpisodeOverview(String episodeOverview) { this.episodeOverview = episodeOverview; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    // Static factory methods
    public static VideoEmbedResponse success(String message, Long tmdbId, String type, String embedUrl) {
        return new VideoEmbedResponse(true, message, tmdbId, type, embedUrl);
    }

    public static VideoEmbedResponse success(String message, Long tmdbId, String type, String embedUrl, 
                                           Integer season, Integer episode, String seriesName, 
                                           String episodeTitle, String episodeOverview) {
        VideoEmbedResponse response = new VideoEmbedResponse(true, message, tmdbId, type, embedUrl);
        response.setSeason(season);
        response.setEpisode(episode);
        response.setSeriesName(seriesName);
        response.setEpisodeTitle(episodeTitle);
        response.setEpisodeOverview(episodeOverview);
        return response;
    }

    public static VideoEmbedResponse error(String error) {
        return new VideoEmbedResponse(false, error);
    }
} 