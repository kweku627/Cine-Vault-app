package com.cinevault.cinevault.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "episodes")
public class Episode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;
    
    @NotNull
    @Column(name = "season_number", nullable = false)
    private Integer seasonNumber;
    
    @NotNull
    @Column(name = "episode_number", nullable = false)
    private Integer episodeNumber;
    
    @NotNull
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;
    
    @Column(name = "release_date")
    private LocalDate releaseDate;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    public Episode() {}
    
    public Episode(Integer seasonNumber, Integer episodeNumber, String title, String overview, LocalDate releaseDate, String videoUrl) {
        this.seasonNumber = seasonNumber;
        this.episodeNumber = episodeNumber;
        this.title = title;
        this.overview = overview;
        this.releaseDate = releaseDate;
        this.videoUrl = videoUrl;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Series getSeries() { return series; }
    public void setSeries(Series series) { this.series = series; }
    
    public Integer getSeasonNumber() { return seasonNumber; }
    public void setSeasonNumber(Integer seasonNumber) { this.seasonNumber = seasonNumber; }
    
    public Integer getEpisodeNumber() { return episodeNumber; }
    public void setEpisodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }
    
    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
    
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    
    @Override
    public String toString() {
        return "Episode{" +
                "id=" + id +
                ", seasonNumber=" + seasonNumber +
                ", episodeNumber=" + episodeNumber +
                ", title='" + title + '\'' +
                ", overview='" + overview + '\'' +
                ", releaseDate=" + releaseDate +
                ", videoUrl='" + videoUrl + '\'' +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Episode episode = (Episode) o;
        
        if (!seasonNumber.equals(episode.seasonNumber)) return false;
        return episodeNumber.equals(episode.episodeNumber);
    }
    
    @Override
    public int hashCode() {
        int result = seasonNumber.hashCode();
        result = 31 * result + episodeNumber.hashCode();
        return result;
    }
} 