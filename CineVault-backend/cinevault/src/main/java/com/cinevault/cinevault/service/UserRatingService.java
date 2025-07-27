package com.cinevault.cinevault.service;

import com.cinevault.cinevault.model.UserRating;
import com.cinevault.cinevault.repository.UserRatingRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserRatingService {
    private final UserRatingRepository userRatingRepository;

    public UserRatingService(UserRatingRepository userRatingRepository) {
        this.userRatingRepository = userRatingRepository;
    }

    public List<UserRating> getRatingsByMovieId(Long movieId) {
        return userRatingRepository.findByMovieId(movieId);
    }

    public UserRating submitRating(UserRating rating) {
        if (rating.getMovieId() == null || rating.getRaterName() == null || rating.getRatingValue() == null) {
            throw new IllegalArgumentException("Movie ID, rater name, and rating value are required");
        }
        if (rating.getRatingValue() < 1 || rating.getRatingValue() > 10) {
            throw new IllegalArgumentException("Rating value must be between 1 and 10");
        }
        // Overwrite if user already rated
        Optional<UserRating> existing = userRatingRepository.findByMovieIdAndRaterName(rating.getMovieId(), rating.getRaterName());
        existing.ifPresent(r -> rating.setId(r.getId()));
        return userRatingRepository.save(rating);
    }
} 