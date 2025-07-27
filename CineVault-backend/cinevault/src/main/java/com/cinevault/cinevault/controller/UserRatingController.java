package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.UserRating;
import com.cinevault.cinevault.service.UserRatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movies/{movieId}/ratings")
public class UserRatingController {
    private final UserRatingService userRatingService;

    public UserRatingController(UserRatingService userRatingService) {
        this.userRatingService = userRatingService;
    }

    @GetMapping
    public List<UserRating> getRatings(@PathVariable Long movieId) {
        return userRatingService.getRatingsByMovieId(movieId);
    }

    @PostMapping
    public ResponseEntity<UserRating> submitRating(@PathVariable Long movieId, @RequestBody UserRating rating) {
        try {
            rating.setMovieId(movieId);
            UserRating saved = userRatingService.submitRating(rating);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 