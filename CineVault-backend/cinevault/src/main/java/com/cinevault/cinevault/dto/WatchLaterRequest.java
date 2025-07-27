package com.cinevault.cinevault.dto;

import jakarta.validation.constraints.NotBlank;

public class WatchLaterRequest {
    
    @NotBlank(message = "Content ID is required")
    private String contentId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    private String poster;
    private String backdrop;
    private String year;
    private String genre;
    
    @NotBlank(message = "Type is required")
    private String type; // "movie" or "series"
    
    private String duration;
    private String rating;

    // Constructors
    public WatchLaterRequest() {}

    public WatchLaterRequest(String contentId, String title, String type) {
        this.contentId = contentId;
        this.title = title;
        this.type = type;
    }

    // Getters and Setters
    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getBackdrop() {
        return backdrop;
    }

    public void setBackdrop(String backdrop) {
        this.backdrop = backdrop;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }
} 