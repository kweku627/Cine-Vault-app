package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.service.MovieLikeService;
import com.cinevault.cinevault.model.MovieLike;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/movies/{movieId}/likes")
public class MovieLikeController {
    private final MovieLikeService movieLikeService;

    public MovieLikeController(MovieLikeService movieLikeService) {
        this.movieLikeService = movieLikeService;
    }

    @GetMapping
    public List<MovieLike> getLikes(@PathVariable Long movieId) {
        return movieLikeService.getLikesByMovieId(movieId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long movieId, @RequestBody Map<String, String> body) {
        String likerName = body.get("likerName");
        if (likerName == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "likerName is required"));
        }
        boolean liked = movieLikeService.toggleLike(movieId, likerName);
        return ResponseEntity.ok(Map.of("liked", liked));
    }
} 