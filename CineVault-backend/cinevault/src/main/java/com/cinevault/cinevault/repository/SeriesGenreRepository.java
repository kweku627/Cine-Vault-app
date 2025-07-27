package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeriesGenreRepository extends JpaRepository<SeriesGenre, Long> {
    List<SeriesGenre> findBySeriesId(Long seriesId);
    List<SeriesGenre> findByGenreNameContainingIgnoreCase(String genreName);
    List<SeriesGenre> findByGenreId(Long genreId);
} 