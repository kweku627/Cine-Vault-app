package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.SeriesNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeriesNetworkRepository extends JpaRepository<SeriesNetwork, Long> {
    List<SeriesNetwork> findBySeriesId(Long seriesId);
    List<SeriesNetwork> findByNetworkNameContainingIgnoreCase(String networkName);
    List<SeriesNetwork> findByOriginCountry(String originCountry);
} 