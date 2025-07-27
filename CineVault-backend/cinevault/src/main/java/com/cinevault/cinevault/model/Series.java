package com.cinevault.cinevault.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "series")
public class Series {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "series_id", nullable = false, unique = true)
    private Long seriesId;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "original_name")
    private String originalName;

    @Column(length = 2000)
    private String overview;

    @Column(name = "first_air_date")
    private LocalDate firstAirDate;

    @Column(name = "last_air_date")
    private LocalDate lastAirDate;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "backdrop_path")
    private String backdropPath;

    @Column(name = "original_language")
    private String originalLanguage;

    @Column(name = "vote_average")
    private Double voteAverage;

    @Column(name = "vote_count")
    private Integer voteCount;

    @Column(name = "popularity")
    private Double popularity;

    @Column(name = "video_url")
    private String videoUrl;

    // New TMDb fields
    @Column(name = "adult")
    private Boolean adult;

    @Column(name = "homepage")
    private String homepage;

    @Column(name = "in_production")
    private Boolean inProduction;

    @Column(name = "number_of_episodes")
    private Integer numberOfEpisodes;

    @Column(name = "number_of_seasons")
    private Integer numberOfSeasons;

    @Column(name = "status")
    private String status;

    @Column(name = "tagline")
    private String tagline;

    @Column(name = "type")
    private String type;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "series_episode_run_time", joinColumns = @JoinColumn(name = "series_id"))
    @Column(name = "runtime_minutes")
    private List<Integer> episodeRunTime = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "series_languages", joinColumns = @JoinColumn(name = "series_id"))
    @Column(name = "language_code")
    private List<String> languages = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "series_origin_countries", joinColumns = @JoinColumn(name = "series_id"))
    @Column(name = "country_code")
    private List<String> originCountry = new ArrayList<>();

    // Complex relationships
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SeriesCreator> createdBy = new ArrayList<>();

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SeriesGenre> genres = new ArrayList<>();

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SeriesNetwork> networks = new ArrayList<>();

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SeriesProductionCompany> productionCompanies = new ArrayList<>();

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SeriesProductionCountry> productionCountries = new ArrayList<>();

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SeriesSpokenLanguage> spokenLanguages = new ArrayList<>();

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SeriesSeason> seasons = new ArrayList<>();

    @OneToOne(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SeriesLastEpisodeToAir lastEpisodeToAir;

    @OneToOne(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SeriesNextEpisodeToAir nextEpisodeToAir;

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("seasonNumber ASC, episodeNumber ASC")
    private List<Episode> episodes = new ArrayList<>();

    public Series() {}

    public Series(Long seriesId, String name, String overview, LocalDate firstAirDate, String posterPath, String backdropPath, String originalLanguage, Double voteAverage, Integer voteCount, Double popularity) {
        this.seriesId = seriesId;
        this.name = name;
        this.overview = overview;
        this.firstAirDate = firstAirDate;
        this.posterPath = posterPath;
        this.backdropPath = backdropPath;
        this.originalLanguage = originalLanguage;
        this.voteAverage = voteAverage;
        this.voteCount = voteCount;
        this.popularity = popularity;
    }

    // Basic getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSeriesId() { return seriesId; }
    public void setSeriesId(Long seriesId) { this.seriesId = seriesId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public LocalDate getFirstAirDate() { return firstAirDate; }
    public void setFirstAirDate(LocalDate firstAirDate) { this.firstAirDate = firstAirDate; }

    public LocalDate getLastAirDate() { return lastAirDate; }
    public void setLastAirDate(LocalDate lastAirDate) { this.lastAirDate = lastAirDate; }

    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }

    public String getBackdropPath() { return backdropPath; }
    public void setBackdropPath(String backdropPath) { this.backdropPath = backdropPath; }

    public String getOriginalLanguage() { return originalLanguage; }
    public void setOriginalLanguage(String originalLanguage) { this.originalLanguage = originalLanguage; }

    public Double getVoteAverage() { return voteAverage; }
    public void setVoteAverage(Double voteAverage) { this.voteAverage = voteAverage; }

    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }

    public Double getPopularity() { return popularity; }
    public void setPopularity(Double popularity) { this.popularity = popularity; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    // New TMDb field getters and setters
    public Boolean getAdult() { return adult; }
    public void setAdult(Boolean adult) { this.adult = adult; }

    public String getHomepage() { return homepage; }
    public void setHomepage(String homepage) { this.homepage = homepage; }

    public Boolean getInProduction() { return inProduction; }
    public void setInProduction(Boolean inProduction) { this.inProduction = inProduction; }

    public Integer getNumberOfEpisodes() { return numberOfEpisodes; }
    public void setNumberOfEpisodes(Integer numberOfEpisodes) { this.numberOfEpisodes = numberOfEpisodes; }

    public Integer getNumberOfSeasons() { return numberOfSeasons; }
    public void setNumberOfSeasons(Integer numberOfSeasons) { this.numberOfSeasons = numberOfSeasons; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<Integer> getEpisodeRunTime() { return episodeRunTime; }
    public void setEpisodeRunTime(List<Integer> episodeRunTime) { this.episodeRunTime = episodeRunTime; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public List<String> getOriginCountry() { return originCountry; }
    public void setOriginCountry(List<String> originCountry) { this.originCountry = originCountry; }

    // Complex object getters and setters
    public List<SeriesCreator> getCreatedBy() { return createdBy; }
    public void setCreatedBy(List<SeriesCreator> createdBy) { this.createdBy = createdBy; }

    public List<SeriesGenre> getGenres() { return genres; }
    public void setGenres(List<SeriesGenre> genres) { this.genres = genres; }

    public List<SeriesNetwork> getNetworks() { return networks; }
    public void setNetworks(List<SeriesNetwork> networks) { this.networks = networks; }

    public List<SeriesProductionCompany> getProductionCompanies() { return productionCompanies; }
    public void setProductionCompanies(List<SeriesProductionCompany> productionCompanies) { this.productionCompanies = productionCompanies; }

    public List<SeriesProductionCountry> getProductionCountries() { return productionCountries; }
    public void setProductionCountries(List<SeriesProductionCountry> productionCountries) { this.productionCountries = productionCountries; }

    public List<SeriesSpokenLanguage> getSpokenLanguages() { return spokenLanguages; }
    public void setSpokenLanguages(List<SeriesSpokenLanguage> spokenLanguages) { this.spokenLanguages = spokenLanguages; }

    public List<SeriesSeason> getSeasons() { return seasons; }
    public void setSeasons(List<SeriesSeason> seasons) { this.seasons = seasons; }

    public SeriesLastEpisodeToAir getLastEpisodeToAir() { return lastEpisodeToAir; }
    public void setLastEpisodeToAir(SeriesLastEpisodeToAir lastEpisodeToAir) { this.lastEpisodeToAir = lastEpisodeToAir; }

    public SeriesNextEpisodeToAir getNextEpisodeToAir() { return nextEpisodeToAir; }
    public void setNextEpisodeToAir(SeriesNextEpisodeToAir nextEpisodeToAir) { this.nextEpisodeToAir = nextEpisodeToAir; }

    public List<Episode> getEpisodes() { return episodes; }
    public void setEpisodes(List<Episode> episodes) { this.episodes = episodes; }

    // Helper methods for complex relationships
    public void addCreator(SeriesCreator creator) {
        if (createdBy == null) {
            createdBy = new ArrayList<>();
        }
        createdBy.add(creator);
        creator.setSeries(this);
    }

    public void addGenre(SeriesGenre genre) {
        if (genres == null) {
            genres = new ArrayList<>();
        }
        genres.add(genre);
        genre.setSeries(this);
    }

    public void addNetwork(SeriesNetwork network) {
        if (networks == null) {
            networks = new ArrayList<>();
        }
        networks.add(network);
        network.setSeries(this);
    }

    public void addProductionCompany(SeriesProductionCompany company) {
        if (productionCompanies == null) {
            productionCompanies = new ArrayList<>();
        }
        productionCompanies.add(company);
        company.setSeries(this);
    }

    public void addProductionCountry(SeriesProductionCountry country) {
        if (productionCountries == null) {
            productionCountries = new ArrayList<>();
        }
        productionCountries.add(country);
        country.setSeries(this);
    }

    public void addSpokenLanguage(SeriesSpokenLanguage language) {
        if (spokenLanguages == null) {
            spokenLanguages = new ArrayList<>();
        }
        spokenLanguages.add(language);
        language.setSeries(this);
    }

    public void addSeason(SeriesSeason season) {
        if (seasons == null) {
            seasons = new ArrayList<>();
        }
        seasons.add(season);
        season.setSeries(this);
    }

    public void addEpisode(Episode episode) {
        if (episodes == null) {
            episodes = new ArrayList<>();
        }
        episodes.add(episode);
        episode.setSeries(this);
    }

    public void removeEpisode(Episode episode) {
        if (episodes != null) {
            episodes.remove(episode);
            episode.setSeries(null);
        }
    }

    public Episode findEpisode(Integer seasonNumber, Integer episodeNumber) {
        if (episodes == null) return null;
        return episodes.stream()
                .filter(episode -> episode.getSeasonNumber().equals(seasonNumber) && 
                                 episode.getEpisodeNumber().equals(episodeNumber))
                .findFirst()
                .orElse(null);
    }

    public List<Episode> getEpisodesBySeason(Integer seasonNumber) {
        if (episodes == null) return new ArrayList<>();
        return episodes.stream()
                .filter(episode -> episode.getSeasonNumber().equals(seasonNumber))
                .toList();
    }

    public int getTotalEpisodes() {
        return episodes != null ? episodes.size() : 0;
    }

    public int getTotalSeasons() {
        if (episodes == null) return 0;
        return (int) episodes.stream()
                .map(Episode::getSeasonNumber)
                .distinct()
                .count();
    }

    // Backward compatibility - alias for name
    public String getTitle() { return name; }
    public void setTitle(String title) { this.name = title; }

    // Backward compatibility - alias for firstAirDate
    public LocalDate getReleaseDate() { return firstAirDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.firstAirDate = releaseDate; }
} 