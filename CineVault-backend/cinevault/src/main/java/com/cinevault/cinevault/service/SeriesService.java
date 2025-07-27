package com.cinevault.cinevault.service;

import com.cinevault.cinevault.model.Series;
import com.cinevault.cinevault.model.Episode;
import com.cinevault.cinevault.repository.SeriesRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SeriesService {
    private final SeriesRepository seriesRepository;

    public SeriesService(SeriesRepository seriesRepository) {
        this.seriesRepository = seriesRepository;
    }

    public List<Series> getAllSeries() {
        return seriesRepository.findAll();
    }

    public Optional<Series> getSeriesBySeriesId(Long seriesId) {
        return seriesRepository.findBySeriesId(seriesId);
    }

    public Series saveSeries(Series series) {
        if (series.getSeriesId() == null || series.getTitle() == null) {
            throw new IllegalArgumentException("Series ID and title are required");
        }
        return seriesRepository.save(series);
    }

    public Series updateSeries(Series series) {
        return seriesRepository.save(series);
    }

    public void deleteSeries(Long id) {
        seriesRepository.deleteById(id);
    }

    // Episode management methods
    public Series addEpisodeToSeries(Long seriesId, Episode episode) {
        Series series = seriesRepository.findBySeriesId(seriesId)
                .orElseThrow(() -> new IllegalArgumentException("Series not found with ID: " + seriesId));
        
        series.addEpisode(episode);
        return seriesRepository.save(series);
    }

    public Series removeEpisodeFromSeries(Long seriesId, Integer seasonNumber, Integer episodeNumber) {
        Series series = seriesRepository.findBySeriesId(seriesId)
                .orElseThrow(() -> new IllegalArgumentException("Series not found with ID: " + seriesId));
        
        Episode episodeToRemove = series.findEpisode(seasonNumber, episodeNumber);
        if (episodeToRemove != null) {
            series.removeEpisode(episodeToRemove);
            return seriesRepository.save(series);
        } else {
            throw new IllegalArgumentException("Episode not found: Season " + seasonNumber + ", Episode " + episodeNumber);
        }
    }

    public Episode findEpisodeInSeries(Long seriesId, Integer seasonNumber, Integer episodeNumber) {
        Series series = seriesRepository.findBySeriesId(seriesId)
                .orElseThrow(() -> new IllegalArgumentException("Series not found with ID: " + seriesId));
        
        return series.findEpisode(seasonNumber, episodeNumber);
    }

    public List<Episode> getEpisodesBySeason(Long seriesId, Integer seasonNumber) {
        Series series = seriesRepository.findBySeriesId(seriesId)
                .orElseThrow(() -> new IllegalArgumentException("Series not found with ID: " + seriesId));
        
        return series.getEpisodesBySeason(seasonNumber);
    }

    public List<Episode> getAllEpisodesForSeries(Long seriesId) {
        Series series = seriesRepository.findBySeriesId(seriesId)
                .orElseThrow(() -> new IllegalArgumentException("Series not found with ID: " + seriesId));
        
        return series.getEpisodes();
    }

    public Series updateEpisodeInSeries(Long seriesId, Integer seasonNumber, Integer episodeNumber, Episode updatedEpisode) {
        Series series = seriesRepository.findBySeriesId(seriesId)
                .orElseThrow(() -> new IllegalArgumentException("Series not found with ID: " + seriesId));
        
        Episode existingEpisode = series.findEpisode(seasonNumber, episodeNumber);
        if (existingEpisode != null) {
            series.removeEpisode(existingEpisode);
            series.addEpisode(updatedEpisode);
            return seriesRepository.save(series);
        } else {
            throw new IllegalArgumentException("Episode not found: Season " + seasonNumber + ", Episode " + episodeNumber);
        }
    }
} 