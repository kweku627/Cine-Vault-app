package com.cinevault.cinevault.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "series_seasons")
public class SeriesSeason {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "season_id")
    private Long seasonId;

    @Column(name = "season_number")
    private Integer seasonNumber;

    @Column(name = "name")
    private String name;

    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;

    @Column(name = "air_date")
    private LocalDate airDate;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "episode_count")
    private Integer episodeCount;

    public SeriesSeason() {}

    public SeriesSeason(Long seasonId, Integer seasonNumber, String name, String overview, LocalDate airDate, String posterPath, Integer episodeCount) {
        this.seasonId = seasonId;
        this.seasonNumber = seasonNumber;
        this.name = name;
        this.overview = overview;
        this.airDate = airDate;
        this.posterPath = posterPath;
        this.episodeCount = episodeCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Series getSeries() { return series; }
    public void setSeries(Series series) { this.series = series; }

    public Long getSeasonId() { return seasonId; }
    public void setSeasonId(Long seasonId) { this.seasonId = seasonId; }

    public Integer getSeasonNumber() { return seasonNumber; }
    public void setSeasonNumber(Integer seasonNumber) { this.seasonNumber = seasonNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public LocalDate getAirDate() { return airDate; }
    public void setAirDate(LocalDate airDate) { this.airDate = airDate; }

    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }

    public Integer getEpisodeCount() { return episodeCount; }
    public void setEpisodeCount(Integer episodeCount) { this.episodeCount = episodeCount; }
} 