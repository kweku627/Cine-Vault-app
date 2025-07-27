package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.*;
import com.cinevault.cinevault.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/series-management")
public class SeriesManagementController {
    private final SeriesCreatorRepository creatorRepository;
    private final SeriesGenreRepository genreRepository;
    private final SeriesNetworkRepository networkRepository;
    private final SeriesProductionCompanyRepository productionCompanyRepository;
    private final SeriesProductionCountryRepository productionCountryRepository;
    private final SeriesSpokenLanguageRepository spokenLanguageRepository;
    private final SeriesSeasonRepository seasonRepository;
    private final SeriesLastEpisodeToAirRepository lastEpisodeRepository;
    private final SeriesNextEpisodeToAirRepository nextEpisodeRepository;

    public SeriesManagementController(
            SeriesCreatorRepository creatorRepository,
            SeriesGenreRepository genreRepository,
            SeriesNetworkRepository networkRepository,
            SeriesProductionCompanyRepository productionCompanyRepository,
            SeriesProductionCountryRepository productionCountryRepository,
            SeriesSpokenLanguageRepository spokenLanguageRepository,
            SeriesSeasonRepository seasonRepository,
            SeriesLastEpisodeToAirRepository lastEpisodeRepository,
            SeriesNextEpisodeToAirRepository nextEpisodeRepository) {
        this.creatorRepository = creatorRepository;
        this.genreRepository = genreRepository;
        this.networkRepository = networkRepository;
        this.productionCompanyRepository = productionCompanyRepository;
        this.productionCountryRepository = productionCountryRepository;
        this.spokenLanguageRepository = spokenLanguageRepository;
        this.seasonRepository = seasonRepository;
        this.lastEpisodeRepository = lastEpisodeRepository;
        this.nextEpisodeRepository = nextEpisodeRepository;
    }

    // Creators
    @GetMapping("/creators/series/{seriesId}")
    public List<SeriesCreator> getCreatorsBySeries(@PathVariable Long seriesId) {
        return creatorRepository.findBySeriesId(seriesId);
    }

    @PostMapping("/creators")
    public SeriesCreator createCreator(@RequestBody SeriesCreator creator) {
        return creatorRepository.save(creator);
    }

    // Genres
    @GetMapping("/genres/series/{seriesId}")
    public List<SeriesGenre> getGenresBySeries(@PathVariable Long seriesId) {
        return genreRepository.findBySeriesId(seriesId);
    }

    @PostMapping("/genres")
    public SeriesGenre createGenre(@RequestBody SeriesGenre genre) {
        return genreRepository.save(genre);
    }

    // Networks
    @GetMapping("/networks/series/{seriesId}")
    public List<SeriesNetwork> getNetworksBySeries(@PathVariable Long seriesId) {
        return networkRepository.findBySeriesId(seriesId);
    }

    @PostMapping("/networks")
    public SeriesNetwork createNetwork(@RequestBody SeriesNetwork network) {
        return networkRepository.save(network);
    }

    // Production Companies
    @GetMapping("/production-companies/series/{seriesId}")
    public List<SeriesProductionCompany> getProductionCompaniesBySeries(@PathVariable Long seriesId) {
        return productionCompanyRepository.findBySeriesId(seriesId);
    }

    @PostMapping("/production-companies")
    public SeriesProductionCompany createProductionCompany(@RequestBody SeriesProductionCompany company) {
        return productionCompanyRepository.save(company);
    }

    // Production Countries
    @GetMapping("/production-countries/series/{seriesId}")
    public List<SeriesProductionCountry> getProductionCountriesBySeries(@PathVariable Long seriesId) {
        return productionCountryRepository.findBySeriesId(seriesId);
    }

    @PostMapping("/production-countries")
    public SeriesProductionCountry createProductionCountry(@RequestBody SeriesProductionCountry country) {
        return productionCountryRepository.save(country);
    }

    // Spoken Languages
    @GetMapping("/spoken-languages/series/{seriesId}")
    public List<SeriesSpokenLanguage> getSpokenLanguagesBySeries(@PathVariable Long seriesId) {
        return spokenLanguageRepository.findBySeriesId(seriesId);
    }

    @PostMapping("/spoken-languages")
    public SeriesSpokenLanguage createSpokenLanguage(@RequestBody SeriesSpokenLanguage language) {
        return spokenLanguageRepository.save(language);
    }

    // Seasons
    @GetMapping("/seasons/series/{seriesId}")
    public List<SeriesSeason> getSeasonsBySeries(@PathVariable Long seriesId) {
        return seasonRepository.findBySeriesIdOrderBySeasonNumberAsc(seriesId);
    }

    @GetMapping("/seasons/series/{seriesId}/season/{seasonNumber}")
    public ResponseEntity<SeriesSeason> getSeasonBySeriesAndNumber(@PathVariable Long seriesId, @PathVariable Integer seasonNumber) {
        return seasonRepository.findBySeriesIdAndSeasonNumber(seriesId, seasonNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/seasons")
    public SeriesSeason createSeason(@RequestBody SeriesSeason season) {
        return seasonRepository.save(season);
    }

    // Last Episode to Air
    @GetMapping("/last-episode/series/{seriesId}")
    public ResponseEntity<SeriesLastEpisodeToAir> getLastEpisodeBySeries(@PathVariable Long seriesId) {
        return lastEpisodeRepository.findBySeriesId(seriesId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/last-episode")
    public SeriesLastEpisodeToAir createLastEpisode(@RequestBody SeriesLastEpisodeToAir lastEpisode) {
        return lastEpisodeRepository.save(lastEpisode);
    }

    // Next Episode to Air
    @GetMapping("/next-episode/series/{seriesId}")
    public ResponseEntity<SeriesNextEpisodeToAir> getNextEpisodeBySeries(@PathVariable Long seriesId) {
        return nextEpisodeRepository.findBySeriesId(seriesId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/next-episode")
    public SeriesNextEpisodeToAir createNextEpisode(@RequestBody SeriesNextEpisodeToAir nextEpisode) {
        return nextEpisodeRepository.save(nextEpisode);
    }

    // Bulk operations
    @DeleteMapping("/series/{seriesId}/creators")
    public ResponseEntity<Void> deleteAllCreatorsBySeries(@PathVariable Long seriesId) {
        List<SeriesCreator> creators = creatorRepository.findBySeriesId(seriesId);
        creatorRepository.deleteAll(creators);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/series/{seriesId}/genres")
    public ResponseEntity<Void> deleteAllGenresBySeries(@PathVariable Long seriesId) {
        List<SeriesGenre> genres = genreRepository.findBySeriesId(seriesId);
        genreRepository.deleteAll(genres);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/series/{seriesId}/networks")
    public ResponseEntity<Void> deleteAllNetworksBySeries(@PathVariable Long seriesId) {
        List<SeriesNetwork> networks = networkRepository.findBySeriesId(seriesId);
        networkRepository.deleteAll(networks);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/series/{seriesId}/production-companies")
    public ResponseEntity<Void> deleteAllProductionCompaniesBySeries(@PathVariable Long seriesId) {
        List<SeriesProductionCompany> companies = productionCompanyRepository.findBySeriesId(seriesId);
        productionCompanyRepository.deleteAll(companies);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/series/{seriesId}/production-countries")
    public ResponseEntity<Void> deleteAllProductionCountriesBySeries(@PathVariable Long seriesId) {
        List<SeriesProductionCountry> countries = productionCountryRepository.findBySeriesId(seriesId);
        productionCountryRepository.deleteAll(countries);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/series/{seriesId}/spoken-languages")
    public ResponseEntity<Void> deleteAllSpokenLanguagesBySeries(@PathVariable Long seriesId) {
        List<SeriesSpokenLanguage> languages = spokenLanguageRepository.findBySeriesId(seriesId);
        spokenLanguageRepository.deleteAll(languages);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/series/{seriesId}/seasons")
    public ResponseEntity<Void> deleteAllSeasonsBySeries(@PathVariable Long seriesId) {
        List<SeriesSeason> seasons = seasonRepository.findBySeriesId(seriesId);
        seasonRepository.deleteAll(seasons);
        return ResponseEntity.noContent().build();
    }
} 