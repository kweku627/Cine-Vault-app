package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.Trailer;
import com.cinevault.cinevault.service.TrailerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/trailers")
public class TrailerController {
    private final TrailerService trailerService;

    public TrailerController(TrailerService trailerService) {
        this.trailerService = trailerService;
    }

    @GetMapping
    public List<Trailer> getAllTrailers() {
        return trailerService.getAllTrailers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trailer> getTrailer(@PathVariable Long id) {
        return trailerService.getTrailerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/movie/{movieId}")
    public List<Trailer> getTrailersByMovie(@PathVariable Long movieId) {
        return trailerService.getTrailersByMovieId(movieId);
    }

    @GetMapping("/series/{seriesId}")
    public List<Trailer> getTrailersBySeries(@PathVariable Long seriesId) {
        return trailerService.getTrailersBySeriesId(seriesId);
    }

    @PostMapping
    public ResponseEntity<Trailer> createTrailer(@RequestBody Trailer trailer) {
        try {
            Trailer saved = trailerService.saveTrailer(trailer);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trailer> updateTrailer(@PathVariable Long id, @RequestBody Trailer trailer) {
        trailer.setId(id);
        Trailer updated = trailerService.saveTrailer(trailer);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrailer(@PathVariable Long id) {
        trailerService.deleteTrailer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{trailerId}/assign/movie/{movieId}")
    public ResponseEntity<Trailer> assignTrailerToMovie(@PathVariable Long trailerId, @PathVariable Long movieId) {
        try {
            Trailer updated = trailerService.assignTrailerToMovie(trailerId, movieId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{trailerId}/assign/series/{seriesId}")
    public ResponseEntity<Trailer> assignTrailerToSeries(@PathVariable Long trailerId, @PathVariable Long seriesId) {
        try {
            Trailer updated = trailerService.assignTrailerToSeries(trailerId, seriesId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
} 