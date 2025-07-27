package com.cinevault.cinevault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "movie_collections")
public class MovieCollection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(name = "collection_id")
    private Long collectionId;

    @Column(name = "collection_name")
    private String collectionName;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "backdrop_path")
    private String backdropPath;

    public MovieCollection() {}

    public MovieCollection(Long collectionId, String collectionName, String posterPath, String backdropPath) {
        this.collectionId = collectionId;
        this.collectionName = collectionName;
        this.posterPath = posterPath;
        this.backdropPath = backdropPath;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    public Long getCollectionId() { return collectionId; }
    public void setCollectionId(Long collectionId) { this.collectionId = collectionId; }

    public String getCollectionName() { return collectionName; }
    public void setCollectionName(String collectionName) { this.collectionName = collectionName; }

    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }

    public String getBackdropPath() { return backdropPath; }
    public void setBackdropPath(String backdropPath) { this.backdropPath = backdropPath; }
} 