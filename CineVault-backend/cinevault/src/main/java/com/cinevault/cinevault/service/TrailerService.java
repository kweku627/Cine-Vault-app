package com.cinevault.cinevault.service;

import com.cinevault.cinevault.model.Trailer;
import com.cinevault.cinevault.model.Movie;
import com.cinevault.cinevault.model.Series;
import com.cinevault.cinevault.repository.TrailerRepository;
import com.cinevault.cinevault.repository.MovieRepository;
import com.cinevault.cinevault.repository.SeriesRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TrailerService {
    private final TrailerRepository trailerRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    public TrailerService(TrailerRepository trailerRepository, MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.trailerRepository = trailerRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }

    public List<Trailer> getAllTrailers() {
        return trailerRepository.findAll();
    }

    public Optional<Trailer> getTrailerById(Long id) {
        return trailerRepository.findById(id);
    }

    public List<Trailer> getTrailersByMovieId(Long movieId) {
        return movieRepository.findByMovieId(movieId)
                .map(trailerRepository::findByMovie)
                .orElse(List.of());
    }

    public List<Trailer> getTrailersBySeriesId(Long seriesId) {
        return seriesRepository.findBySeriesId(seriesId)
                .map(trailerRepository::findBySeries)
                .orElse(List.of());
    }

    public Trailer saveTrailer(Trailer trailer) {
        // Only one of movie or series should be set
        if ((trailer.getMovie() == null && trailer.getSeries() == null) ||
            (trailer.getMovie() != null && trailer.getSeries() != null)) {
            throw new IllegalArgumentException("Trailer must be assigned to either a movie or a series, not both or neither.");
        }
        return trailerRepository.save(trailer);
    }

    public void deleteTrailer(Long id) {
        trailerRepository.deleteById(id);
    }

    public Trailer assignTrailerToMovie(Long trailerId, Long movieId) {
        Trailer trailer = trailerRepository.findById(trailerId).orElseThrow();
        Movie movie = movieRepository.findByMovieId(movieId).orElseThrow();
        trailer.setMovie(movie);
        trailer.setSeries(null);
        return trailerRepository.save(trailer);
    }

    public Trailer assignTrailerToSeries(Long trailerId, Long seriesId) {
        Trailer trailer = trailerRepository.findById(trailerId).orElseThrow();
        Series series = seriesRepository.findBySeriesId(seriesId).orElseThrow();
        trailer.setSeries(series);
        trailer.setMovie(null);
        return trailerRepository.save(trailer);
    }
} 