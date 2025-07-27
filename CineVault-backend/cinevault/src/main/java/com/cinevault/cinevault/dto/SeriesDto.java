package com.cinevault.cinevault.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class SeriesDto {
    private Long id;
    private String name;
    private String overview;
    
    @JsonProperty("poster_path")
    private String posterPath;
    
    @JsonProperty("video_link")
    private String videoLink;
    
    @JsonProperty("first_air_date")
    private String firstAirDate;
    
    @JsonProperty("last_air_date")
    private String lastAirDate;
    
    @JsonProperty("vote_average")
    private Double voteAverage;
    
    @JsonProperty("vote_count")
    private Integer voteCount;
    
    @JsonProperty("number_of_seasons")
    private Integer numberOfSeasons;
    
    @JsonProperty("number_of_episodes")
    private Integer numberOfEpisodes;
    
    private String status;
    private String type;
    private List<String> genres;
    private List<String> networks;
    
    // Constructors
    public SeriesDto() {}
    
    public SeriesDto(Long id, String name, String overview, String posterPath, String videoLink) {
        this.id = id;
        this.name = name;
        this.overview = overview;
        this.posterPath = posterPath;
        this.videoLink = videoLink;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getOverview() {
        return overview;
    }
    
    public void setOverview(String overview) {
        this.overview = overview;
    }
    
    public String getPosterPath() {
        return posterPath;
    }
    
    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }
    
    public String getVideoLink() {
        return videoLink;
    }
    
    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }
    
    public String getFirstAirDate() {
        return firstAirDate;
    }
    
    public void setFirstAirDate(String firstAirDate) {
        this.firstAirDate = firstAirDate;
    }
    
    public String getLastAirDate() {
        return lastAirDate;
    }
    
    public void setLastAirDate(String lastAirDate) {
        this.lastAirDate = lastAirDate;
    }
    
    public Double getVoteAverage() {
        return voteAverage;
    }
    
    public void setVoteAverage(Double voteAverage) {
        this.voteAverage = voteAverage;
    }
    
    public Integer getVoteCount() {
        return voteCount;
    }
    
    public void setVoteCount(Integer voteCount) {
        this.voteCount = voteCount;
    }
    
    public Integer getNumberOfSeasons() {
        return numberOfSeasons;
    }
    
    public void setNumberOfSeasons(Integer numberOfSeasons) {
        this.numberOfSeasons = numberOfSeasons;
    }
    
    public Integer getNumberOfEpisodes() {
        return numberOfEpisodes;
    }
    
    public void setNumberOfEpisodes(Integer numberOfEpisodes) {
        this.numberOfEpisodes = numberOfEpisodes;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public List<String> getGenres() {
        return genres;
    }
    
    public void setGenres(List<String> genres) {
        this.genres = genres;
    }
    
    public List<String> getNetworks() {
        return networks;
    }
    
    public void setNetworks(List<String> networks) {
        this.networks = networks;
    }
    
    @Override
    public String toString() {
        return "SeriesDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", overview='" + overview + '\'' +
                ", posterPath='" + posterPath + '\'' +
                ", videoLink='" + videoLink + '\'' +
                ", firstAirDate='" + firstAirDate + '\'' +
                ", lastAirDate='" + lastAirDate + '\'' +
                ", voteAverage=" + voteAverage +
                ", voteCount=" + voteCount +
                ", numberOfSeasons=" + numberOfSeasons +
                ", numberOfEpisodes=" + numberOfEpisodes +
                ", status='" + status + '\'' +
                ", type='" + type + '\'' +
                ", genres=" + genres +
                ", networks=" + networks +
                '}';
    }
} 