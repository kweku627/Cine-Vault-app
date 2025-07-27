package com.cinevault.cinevault.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "series_last_episode_to_air")
public class SeriesLastEpisodeToAir {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "episode_id")
    private Long episodeId;

    @Column(name = "name")
    private String name;

    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;

    @Column(name = "air_date")
    private LocalDate airDate;

    @Column(name = "episode_number")
    private Integer episodeNumber;

    @Column(name = "season_number")
    private Integer seasonNumber;

    @Column(name = "still_path")
    private String stillPath;

    @Column(name = "vote_average")
    private Double voteAverage;

    @Column(name = "vote_count")
    private Integer voteCount;

    public SeriesLastEpisodeToAir() {}

    public SeriesLastEpisodeToAir(Long episodeId, String name, String overview, LocalDate airDate, Integer episodeNumber, Integer seasonNumber, String stillPath, Double voteAverage, Integer voteCount) {
        this.episodeId = episodeId;
        this.name = name;
        this.overview = overview;
        this.airDate = airDate;
        this.episodeNumber = episodeNumber;
        this.seasonNumber = seasonNumber;
        this.stillPath = stillPath;
        this.voteAverage = voteAverage;
        this.voteCount = voteCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Series getSeries() { return series; }
    public void setSeries(Series series) { this.series = series; }

    public Long getEpisodeId() { return episodeId; }
    public void setEpisodeId(Long episodeId) { this.episodeId = episodeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public LocalDate getAirDate() { return airDate; }
    public void setAirDate(LocalDate airDate) { this.airDate = airDate; }

    public Integer getEpisodeNumber() { return episodeNumber; }
    public void setEpisodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; }

    public Integer getSeasonNumber() { return seasonNumber; }
    public void setSeasonNumber(Integer seasonNumber) { this.seasonNumber = seasonNumber; }

    public String getStillPath() { return stillPath; }
    public void setStillPath(String stillPath) { this.stillPath = stillPath; }

    public Double getVoteAverage() { return voteAverage; }
    public void setVoteAverage(Double voteAverage) { this.voteAverage = voteAverage; }

    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
} 