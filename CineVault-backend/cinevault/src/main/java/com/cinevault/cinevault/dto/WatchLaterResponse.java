package com.cinevault.cinevault.dto;

import com.cinevault.cinevault.model.WatchLater;
import java.time.LocalDateTime;

public class WatchLaterResponse {
    private Long id;
    private String contentId;
    private String title;
    private String description;
    private String poster;
    private String backdrop;
    private String year;
    private String genre;
    private String type;
    private String duration;
    private String rating;
    private LocalDateTime createdAt;

    // Constructors
    public WatchLaterResponse() {}

    public WatchLaterResponse(WatchLater watchLater) {
        this.id = watchLater.getId();
        this.contentId = watchLater.getContentId();
        this.title = watchLater.getTitle();
        this.description = watchLater.getDescription();
        this.poster = watchLater.getPoster();
        this.backdrop = watchLater.getBackdrop();
        this.year = watchLater.getYear();
        this.genre = watchLater.getGenre();
        this.type = watchLater.getType();
        this.duration = watchLater.getDuration();
        this.rating = watchLater.getRating();
        this.createdAt = watchLater.getCreatedAt();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "WatchLaterResponse{" +
                "id=" + id +
                ", contentId='" + contentId + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", poster='" + poster + '\'' +
                ", backdrop='" + backdrop + '\'' +
                ", year='" + year + '\'' +
                ", genre='" + genre + '\'' +
                ", type='" + type + '\'' +
                ", duration='" + duration + '\'' +
                ", rating='" + rating + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 