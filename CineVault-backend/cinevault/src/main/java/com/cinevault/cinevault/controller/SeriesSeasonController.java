package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.SeriesSeason;
import com.cinevault.cinevault.repository.SeriesSeasonRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/series-seasons")
public class SeriesSeasonController {
    private final SeriesSeasonRepository seriesSeasonRepository;

    public SeriesSeasonController(SeriesSeasonRepository seriesSeasonRepository) {
        this.seriesSeasonRepository = seriesSeasonRepository;
    }

    @GetMapping
    public List<SeriesSeason> getAllSeasons() {
        return seriesSeasonRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeriesSeason> getSeason(@PathVariable Long id) {
        return seriesSeasonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/series/{seriesId}")
    public List<SeriesSeason> getSeasonsBySeries(@PathVariable Long seriesId) {
        return seriesSeasonRepository.findBySeriesIdOrderBySeasonNumberAsc(seriesId);
    }

    @GetMapping("/series/{seriesId}/season/{seasonNumber}")
    public ResponseEntity<SeriesSeason> getSeasonBySeriesAndNumber(@PathVariable Long seriesId, @PathVariable Integer seasonNumber) {
        return seriesSeasonRepository.findBySeriesIdAndSeasonNumber(seriesId, seasonNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/season-number/{seasonNumber}")
    public List<SeriesSeason> getSeasonsByNumber(@PathVariable Integer seasonNumber) {
        return seriesSeasonRepository.findBySeasonNumber(seasonNumber);
    }

    @PostMapping
    public SeriesSeason createSeason(@RequestBody SeriesSeason season) {
        return seriesSeasonRepository.save(season);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeriesSeason> updateSeason(@PathVariable Long id, @RequestBody SeriesSeason season) {
        if (!seriesSeasonRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        season.setId(id);
        return ResponseEntity.ok(seriesSeasonRepository.save(season));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeason(@PathVariable Long id) {
        if (!seriesSeasonRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        seriesSeasonRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 