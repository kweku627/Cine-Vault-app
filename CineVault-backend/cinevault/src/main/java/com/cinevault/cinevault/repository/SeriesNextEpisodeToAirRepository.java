package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesNextEpisodeToAir;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SeriesNextEpisodeToAirRepository extends JpaRepository<SeriesNextEpisodeToAir, Long> {
    Optional<SeriesNextEpisodeToAir> findBySeriesId(Long seriesId);
} 