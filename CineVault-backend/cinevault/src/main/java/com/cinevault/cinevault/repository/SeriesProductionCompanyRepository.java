package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesProductionCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeriesProductionCompanyRepository extends JpaRepository<SeriesProductionCompany, Long> {
    List<SeriesProductionCompany> findBySeriesId(Long seriesId);
    List<SeriesProductionCompany> findByCompanyNameContainingIgnoreCase(String companyName);
    List<SeriesProductionCompany> findByOriginCountry(String originCountry);
} 