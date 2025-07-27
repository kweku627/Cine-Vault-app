package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.MovieLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MovieLikeRepository extends JpaRepository<MovieLike, Long> {
    List<MovieLike> findByMovieId(Long movieId);
    Optional<MovieLike> findByMovieIdAndLikerName(Long movieId, String likerName);
} 