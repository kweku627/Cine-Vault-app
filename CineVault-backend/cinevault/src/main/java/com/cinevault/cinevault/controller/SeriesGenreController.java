package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.SeriesGenre;
import com.cinevault.cinevault.repository.SeriesGenreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/series-genres")
public class SeriesGenreController {
    private final SeriesGenreRepository seriesGenreRepository;

    public SeriesGenreController(SeriesGenreRepository seriesGenreRepository) {
        this.seriesGenreRepository = seriesGenreRepository;
    }

    @GetMapping
    public List<SeriesGenre> getAllGenres() {
        return seriesGenreRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeriesGenre> getGenre(@PathVariable Long id) {
        return seriesGenreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/series/{seriesId}")
    public List<SeriesGenre> getGenresBySeries(@PathVariable Long seriesId) {
        return seriesGenreRepository.findBySeriesId(seriesId);
    }

    @GetMapping("/search")
    public List<SeriesGenre> searchGenres(@RequestParam String name) {
        return seriesGenreRepository.findByGenreNameContainingIgnoreCase(name);
    }

    @GetMapping("/genre-id/{genreId}")
    public List<SeriesGenre> getGenresByGenreId(@PathVariable Long genreId) {
        return seriesGenreRepository.findByGenreId(genreId);
    }

    @PostMapping
    public SeriesGenre createGenre(@RequestBody SeriesGenre genre) {
        return seriesGenreRepository.save(genre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeriesGenre> updateGenre(@PathVariable Long id, @RequestBody SeriesGenre genre) {
        if (!seriesGenreRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        genre.setId(id);
        return ResponseEntity.ok(seriesGenreRepository.save(genre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        if (!seriesGenreRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        seriesGenreRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 