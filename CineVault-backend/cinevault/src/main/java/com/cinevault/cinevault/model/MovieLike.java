package com.cinevault.cinevault.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "movie_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"movie_id", "liker_name"})
})
public class MovieLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long movieId;

    @NotNull
    private String likerName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public MovieLike() {}

    public MovieLike(Long movieId, String likerName) {
        this.movieId = movieId;
        this.likerName = likerName;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getLikerName() { return likerName; }
    public void setLikerName(String likerName) { this.likerName = likerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 