package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.Series;
import com.cinevault.cinevault.model.Episode;
import com.cinevault.cinevault.service.SeriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/series")
public class SeriesController {
    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @GetMapping
    public List<Series> getAllSeries() {
        return seriesService.getAllSeries();
    }

    @GetMapping("/{seriesId}")
    public ResponseEntity<Series> getSeries(@PathVariable Long seriesId) {
        return seriesService.getSeriesBySeriesId(seriesId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Series> saveSeries(@RequestBody Series series) {
        try {
            Series saved = seriesService.saveSeries(series);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Series> updateSeries(@PathVariable Long id, @RequestBody Series series) {
        series.setId(id);
        Series updated = seriesService.updateSeries(series);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
        seriesService.deleteSeries(id);
        return ResponseEntity.noContent().build();
    }

    // Episode management endpoints
    @PostMapping("/{seriesId}/episodes")
    public ResponseEntity<Series> addEpisodeToSeries(@PathVariable Long seriesId, @RequestBody Episode episode) {
        try {
            Series updatedSeries = seriesService.addEpisodeToSeries(seriesId, episode);
            return ResponseEntity.ok(updatedSeries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{seriesId}/episodes/{seasonNumber}/{episodeNumber}")
    public ResponseEntity<Series> removeEpisodeFromSeries(
            @PathVariable Long seriesId,
            @PathVariable Integer seasonNumber,
            @PathVariable Integer episodeNumber) {
        try {
            Series updatedSeries = seriesService.removeEpisodeFromSeries(seriesId, seasonNumber, episodeNumber);
            return ResponseEntity.ok(updatedSeries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{seriesId}/episodes/{seasonNumber}/{episodeNumber}")
    public ResponseEntity<Episode> getEpisode(
            @PathVariable Long seriesId,
            @PathVariable Integer seasonNumber,
            @PathVariable Integer episodeNumber) {
        try {
            Episode episode = seriesService.findEpisodeInSeries(seriesId, seasonNumber, episodeNumber);
            return ResponseEntity.ok(episode);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{seriesId}/episodes")
    public ResponseEntity<List<Episode>> getAllEpisodesForSeries(@PathVariable Long seriesId) {
        try {
            List<Episode> episodes = seriesService.getAllEpisodesForSeries(seriesId);
            return ResponseEntity.ok(episodes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{seriesId}/episodes/season/{seasonNumber}")
    public ResponseEntity<List<Episode>> getEpisodesBySeason(
            @PathVariable Long seriesId,
            @PathVariable Integer seasonNumber) {
        try {
            List<Episode> episodes = seriesService.getEpisodesBySeason(seriesId, seasonNumber);
            return ResponseEntity.ok(episodes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{seriesId}/episodes/{seasonNumber}/{episodeNumber}")
    public ResponseEntity<Series> updateEpisode(
            @PathVariable Long seriesId,
            @PathVariable Integer seasonNumber,
            @PathVariable Integer episodeNumber,
            @RequestBody Episode updatedEpisode) {
        try {
            Series updatedSeries = seriesService.updateEpisodeInSeries(seriesId, seasonNumber, episodeNumber, updatedEpisode);
            return ResponseEntity.ok(updatedSeries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 