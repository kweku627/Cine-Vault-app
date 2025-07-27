package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeriesRepository extends JpaRepository<Series, Long> {
    Optional<Series> findBySeriesId(Long seriesId);
} 