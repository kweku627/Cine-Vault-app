package com.cinevault.cinevault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "series_creators")
public class SeriesCreator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "creator_id")
    private Long creatorId;

    @Column(name = "creator_name")
    private String creatorName;

    @Column(name = "profile_path")
    private String profilePath;

    public SeriesCreator() {}

    public SeriesCreator(Long creatorId, String creatorName, String profilePath) {
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.profilePath = profilePath;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Series getSeries() { return series; }
    public void setSeries(Series series) { this.series = series; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public String getProfilePath() { return profilePath; }
    public void setProfilePath(String profilePath) { this.profilePath = profilePath; }
} 