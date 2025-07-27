package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesLastEpisodeToAir;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SeriesLastEpisodeToAirRepository extends JpaRepository<SeriesLastEpisodeToAir, Long> {
    Optional<SeriesLastEpisodeToAir> findBySeriesId(Long seriesId);
} 