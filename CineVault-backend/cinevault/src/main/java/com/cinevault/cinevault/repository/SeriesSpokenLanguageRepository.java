package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesSpokenLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeriesSpokenLanguageRepository extends JpaRepository<SeriesSpokenLanguage, Long> {
    List<SeriesSpokenLanguage> findBySeriesId(Long seriesId);
    List<SeriesSpokenLanguage> findByLanguageCode(String languageCode);
    List<SeriesSpokenLanguage> findByLanguageNameContainingIgnoreCase(String languageName);
} 