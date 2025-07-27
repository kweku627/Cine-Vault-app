package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesCreator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeriesCreatorRepository extends JpaRepository<SeriesCreator, Long> {
    List<SeriesCreator> findBySeriesId(Long seriesId);
    List<SeriesCreator> findByCreatorNameContainingIgnoreCase(String creatorName);
} 