package com.cinevault.cinevault.service;

import com.cinevault.cinevault.model.MovieLike;
import com.cinevault.cinevault.repository.MovieLikeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MovieLikeService {
    private final MovieLikeRepository movieLikeRepository;

    public MovieLikeService(MovieLikeRepository movieLikeRepository) {
        this.movieLikeRepository = movieLikeRepository;
    }

    public List<MovieLike> getLikesByMovieId(Long movieId) {
        return movieLikeRepository.findByMovieId(movieId);
    }

    public boolean toggleLike(Long movieId, String likerName) {
        Optional<MovieLike> existing = movieLikeRepository.findByMovieIdAndLikerName(movieId, likerName);
        if (existing.isPresent()) {
            movieLikeRepository.delete(existing.get());
            return false; // Like removed
        } else {
            MovieLike like = new MovieLike();
            like.setMovieId(movieId);
            like.setLikerName(likerName);
            movieLikeRepository.save(like);
            return true; // Like added
        }
    }
} 