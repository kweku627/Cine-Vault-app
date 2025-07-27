package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.UserRating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRatingRepository extends JpaRepository<UserRating, Long> {
    List<UserRating> findByMovieId(Long movieId);
    Optional<UserRating> findByMovieIdAndRaterName(Long movieId, String raterName);
} 