package com.cinevault.cinevault.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "movies", uniqueConstraints = {@UniqueConstraint(columnNames = {"tmdb_id"})})
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "tmdb_id", nullable = false, unique = true)
    private Long movieId;

    @NotNull
    @Column(nullable = false)
    private String title;

    @Column(name = "original_title")
    private String originalTitle;

    @Column(length = 2000)
    private String overview;

    @Column(name = "release_date")
    private LocalDate releaseDate;

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

    @Column(name = "last_synced")
    private java.time.LocalDateTime lastSynced;

    @Column(name = "video_url")
    private String videoUrl;

    // New TMDb fields
    @Column(name = "adult")
    private Boolean adult;

    @Column(name = "budget")
    private Long budget;

    @Column(name = "homepage")
    private String homepage;

    @Column(name = "imdb_id")
    private String imdbId;

    @Column(name = "runtime")
    private Integer runtime;

    @Column(name = "revenue")
    private Long revenue;

    @Column(name = "status")
    private String status;

    @Column(name = "tagline")
    private String tagline;

    @Column(name = "video")
    private Boolean video;

    // Complex objects as separate entities
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovieGenre> genres = new ArrayList<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovieProductionCompany> productionCompanies = new ArrayList<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovieProductionCountry> productionCountries = new ArrayList<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovieSpokenLanguage> spokenLanguages = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "movie_origin_countries", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "country_code")
    private List<String> originCountries = new ArrayList<>();

    @OneToOne(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private MovieCollection belongsToCollection;

    // Constructors
    public Movie() {}

    public Movie(Long movieId, String title, String overview, LocalDate releaseDate, String posterPath, String backdropPath, String originalLanguage, Double voteAverage, Integer voteCount, Double popularity) {
        this.movieId = movieId;
        this.title = title;
        this.overview = overview;
        this.releaseDate = releaseDate;
        this.posterPath = posterPath;
        this.backdropPath = backdropPath;
        this.originalLanguage = originalLanguage;
        this.voteAverage = voteAverage;
        this.voteCount = voteCount;
        this.popularity = popularity;
        this.lastSynced = java.time.LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOriginalTitle() { return originalTitle; }
    public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

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

    public java.time.LocalDateTime getLastSynced() { return lastSynced; }
    public void setLastSynced(java.time.LocalDateTime lastSynced) { this.lastSynced = lastSynced; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    // New TMDb field getters and setters
    public Boolean getAdult() { return adult; }
    public void setAdult(Boolean adult) { this.adult = adult; }

    public Long getBudget() { return budget; }
    public void setBudget(Long budget) { this.budget = budget; }

    public String getHomepage() { return homepage; }
    public void setHomepage(String homepage) { this.homepage = homepage; }

    public String getImdbId() { return imdbId; }
    public void setImdbId(String imdbId) { this.imdbId = imdbId; }

    public Integer getRuntime() { return runtime; }
    public void setRuntime(Integer runtime) { this.runtime = runtime; }

    public Long getRevenue() { return revenue; }
    public void setRevenue(Long revenue) { this.revenue = revenue; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public Boolean getVideo() { return video; }
    public void setVideo(Boolean video) { this.video = video; }

    // Complex object getters and setters
    public List<MovieGenre> getGenres() { return genres; }
    public void setGenres(List<MovieGenre> genres) { this.genres = genres; }

    public List<MovieProductionCompany> getProductionCompanies() { return productionCompanies; }
    public void setProductionCompanies(List<MovieProductionCompany> productionCompanies) { this.productionCompanies = productionCompanies; }

    public List<MovieProductionCountry> getProductionCountries() { return productionCountries; }
    public void setProductionCountries(List<MovieProductionCountry> productionCountries) { this.productionCountries = productionCountries; }

    public List<MovieSpokenLanguage> getSpokenLanguages() { return spokenLanguages; }
    public void setSpokenLanguages(List<MovieSpokenLanguage> spokenLanguages) { this.spokenLanguages = spokenLanguages; }

    public List<String> getOriginCountries() { return originCountries; }
    public void setOriginCountries(List<String> originCountries) { this.originCountries = originCountries; }

    public MovieCollection getBelongsToCollection() { return belongsToCollection; }
    public void setBelongsToCollection(MovieCollection belongsToCollection) { this.belongsToCollection = belongsToCollection; }

    // Helper methods
    public void addGenre(MovieGenre genre) {
        if (genres == null) {
            genres = new ArrayList<>();
        }
        genres.add(genre);
        genre.setMovie(this);
    }

    public void addProductionCompany(MovieProductionCompany company) {
        if (productionCompanies == null) {
            productionCompanies = new ArrayList<>();
        }
        productionCompanies.add(company);
        company.setMovie(this);
    }

    public void addProductionCountry(MovieProductionCountry country) {
        if (productionCountries == null) {
            productionCountries = new ArrayList<>();
        }
        productionCountries.add(country);
        country.setMovie(this);
    }

    public void addSpokenLanguage(MovieSpokenLanguage language) {
        if (spokenLanguages == null) {
            spokenLanguages = new ArrayList<>();
        }
        spokenLanguages.add(language);
        language.setMovie(this);
    }

    public void addOriginCountry(String countryCode) {
        if (originCountries == null) {
            originCountries = new ArrayList<>();
        }
        originCountries.add(countryCode);
    }
} 