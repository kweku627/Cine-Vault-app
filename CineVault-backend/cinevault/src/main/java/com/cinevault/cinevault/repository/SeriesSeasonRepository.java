package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesSeason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeriesSeasonRepository extends JpaRepository<SeriesSeason, Long> {
    List<SeriesSeason> findBySeriesId(Long seriesId);
    List<SeriesSeason> findBySeriesIdOrderBySeasonNumberAsc(Long seriesId);
    Optional<SeriesSeason> findBySeriesIdAndSeasonNumber(Long seriesId, Integer seasonNumber);
    List<SeriesSeason> findBySeasonNumber(Integer seasonNumber);
} 