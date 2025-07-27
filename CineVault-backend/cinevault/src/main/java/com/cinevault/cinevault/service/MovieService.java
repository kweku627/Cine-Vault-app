package com.cinevault.cinevault.service;

import com.cinevault.cinevault.model.Movie;
import com.cinevault.cinevault.repository.MovieRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {
    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieByMovieId(Long movieId) {
        return movieRepository.findByMovieId(movieId);
    }

    public Movie saveMovie(Movie movie) {
        if (movie.getMovieId() == null || movie.getTitle() == null) {
            throw new IllegalArgumentException("Movie TMDb ID and title are required");
        }
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Movie movie) {
        return movieRepository.save(movie);
    }
} 