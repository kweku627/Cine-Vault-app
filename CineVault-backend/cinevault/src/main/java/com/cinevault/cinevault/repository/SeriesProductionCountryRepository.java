package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesProductionCountry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeriesProductionCountryRepository extends JpaRepository<SeriesProductionCountry, Long> {
    List<SeriesProductionCountry> findBySeriesId(Long seriesId);
    List<SeriesProductionCountry> findByCountryCode(String countryCode);
    List<SeriesProductionCountry> findByCountryNameContainingIgnoreCase(String countryName);
} 