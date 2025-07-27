package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.Trailer;
import com.cinevault.cinevault.model.Movie;
import com.cinevault.cinevault.model.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrailerRepository extends JpaRepository<Trailer, Long> {
    List<Trailer> findByMovie(Movie movie);
    List<Trailer> findBySeries(Series series);
} 