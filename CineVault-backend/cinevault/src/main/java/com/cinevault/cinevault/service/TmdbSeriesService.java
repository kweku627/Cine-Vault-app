package com.cinevault.cinevault.service;

import com.cinevault.cinevault.dto.SeriesDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class TmdbSeriesService {
    
    @Value("${tmdb.api.key:a0a06ec6441660e15436c849e23b899a}")
    private String tmdbApiKey;
    
    @Value("${tmdb.base.url:https://api.themoviedb.org/3}")
    private String tmdbBaseUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public TmdbSeriesService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Fetch detailed TV series information from TMDB API
     */
    public SeriesDto getSeriesDetails(Long seriesId) {
        try {
            String url = String.format("%s/tv/%d?api_key=%s", 
                tmdbBaseUrl, seriesId, tmdbApiKey);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode seriesNode = objectMapper.readTree(response.getBody());
                return parseSeriesFromJson(seriesNode);
            }
        } catch (Exception e) {
            System.out.println("TMDB Series Details API error for series " + seriesId + ": " + e.getMessage());
        }
        
        return null;
    }

    /**
     * Fetch popular TV series from TMDB API with detailed information
     */
    public List<SeriesDto> getPopularSeries(int page) {
        try {
            String url = String.format("%s/discover/tv?api_key=%s&sort_by=popularity.desc&page=%d", 
                tmdbBaseUrl, tmdbApiKey, page);
            
            System.out.println("TMDB Series API URL: " + url.replace(tmdbApiKey, "***API_KEY_HIDDEN***"));
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<SeriesDto> series = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode seriesNode : resultsNode) {
                        // First get basic info from summary
                        SeriesDto basicSeries = parseSeriesFromJson(seriesNode);
                        if (basicSeries != null && basicSeries.getId() != null) {
                            // Then fetch detailed information
                            SeriesDto detailedSeries = getSeriesDetails(basicSeries.getId());
                            if (detailedSeries != null) {
                                series.add(detailedSeries);
                            } else {
                                // Fallback to basic info if detailed fetch fails
                                series.add(basicSeries);
                            }
                        }
                    }
                }
                
                System.out.println("TMDB Series API returned " + series.size() + " popular series");
                return series;
            } else {
                System.out.println("TMDB Series API request failed with status: " + response.getStatusCode());
                if (response.getBody() != null) {
                    System.out.println("TMDB Series API response: " + response.getBody());
                }
            }
        } catch (Exception e) {
            System.out.println("TMDB Series API error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Fetch trending TV series from TMDB API with detailed information
     */
    public List<SeriesDto> getTrendingSeries(int page) {
        try {
            String url = String.format("%s/trending/tv/week?api_key=%s&page=%d", 
                tmdbBaseUrl, tmdbApiKey, page);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<SeriesDto> series = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode seriesNode : resultsNode) {
                        // First get basic info from summary
                        SeriesDto basicSeries = parseSeriesFromJson(seriesNode);
                        if (basicSeries != null && basicSeries.getId() != null) {
                            // Then fetch detailed information
                            SeriesDto detailedSeries = getSeriesDetails(basicSeries.getId());
                            if (detailedSeries != null) {
                                series.add(detailedSeries);
                            } else {
                                // Fallback to basic info if detailed fetch fails
                                series.add(basicSeries);
                            }
                        }
                    }
                }
                
                return series;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Search TV series by title with detailed information
     */
    public List<SeriesDto> searchSeries(String query, int page) {
        try {
            String encodedQuery = java.net.URLEncoder.encode(query, "UTF-8");
            String url = String.format("%s/search/tv?api_key=%s&query=%s&page=%d", 
                tmdbBaseUrl, tmdbApiKey, encodedQuery, page);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<SeriesDto> series = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode seriesNode : resultsNode) {
                        // First get basic info from summary
                        SeriesDto basicSeries = parseSeriesFromJson(seriesNode);
                        if (basicSeries != null && basicSeries.getId() != null) {
                            // Then fetch detailed information
                            SeriesDto detailedSeries = getSeriesDetails(basicSeries.getId());
                            if (detailedSeries != null) {
                                series.add(detailedSeries);
                            } else {
                                // Fallback to basic info if detailed fetch fails
                                series.add(basicSeries);
                            }
                        }
                    }
                }
                
                return series;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Get TV series by genre with detailed information
     */
    public List<SeriesDto> getSeriesByGenre(int genreId, int page) {
        try {
            String url = String.format("%s/discover/tv?api_key=%s&with_genres=%d&sort_by=popularity.desc&page=%d", 
                tmdbBaseUrl, tmdbApiKey, genreId, page);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<SeriesDto> series = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode seriesNode : resultsNode) {
                        // First get basic info from summary
                        SeriesDto basicSeries = parseSeriesFromJson(seriesNode);
                        if (basicSeries != null && basicSeries.getId() != null) {
                            // Then fetch detailed information
                            SeriesDto detailedSeries = getSeriesDetails(basicSeries.getId());
                            if (detailedSeries != null) {
                                series.add(detailedSeries);
                            } else {
                                // Fallback to basic info if detailed fetch fails
                                series.add(basicSeries);
                            }
                        }
                    }
                }
                
                return series;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Parse series data from TMDB JSON response
     */
    private SeriesDto parseSeriesFromJson(JsonNode seriesNode) {
        try {
            Long id = seriesNode.get("id") != null ? seriesNode.get("id").asLong() : null;
            String name = seriesNode.get("name") != null ? seriesNode.get("name").asText() : "";
            String overview = seriesNode.get("overview") != null ? seriesNode.get("overview").asText() : "";
            String posterPath = seriesNode.get("poster_path") != null ? seriesNode.get("poster_path").asText() : "";
            String firstAirDate = seriesNode.get("first_air_date") != null ? seriesNode.get("first_air_date").asText() : "";
            String lastAirDate = seriesNode.get("last_air_date") != null ? seriesNode.get("last_air_date").asText() : "";
            Double voteAverage = seriesNode.get("vote_average") != null ? seriesNode.get("vote_average").asDouble() : 0.0;
            Integer voteCount = seriesNode.get("vote_count") != null ? seriesNode.get("vote_count").asInt() : 0;
            Integer numberOfSeasons = seriesNode.get("number_of_seasons") != null ? seriesNode.get("number_of_seasons").asInt() : 0;
            Integer numberOfEpisodes = seriesNode.get("number_of_episodes") != null ? seriesNode.get("number_of_episodes").asInt() : 0;
            String status = seriesNode.get("status") != null ? seriesNode.get("status").asText() : "";
            String type = seriesNode.get("type") != null ? seriesNode.get("type").asText() : "";
            
            // Generate video link using vidsrc.to
            String videoLink = generateVideoLink(id);
            
            // Parse genres - handle both summary (genre_ids) and detailed (genres) formats
            List<String> genres = new ArrayList<>();
            if (seriesNode.has("genre_ids") && seriesNode.get("genre_ids").isArray()) {
                // Summary format - genre_ids array
                for (JsonNode genreId : seriesNode.get("genre_ids")) {
                    genres.add(getGenreName(genreId.asInt()));
                }
            } else if (seriesNode.has("genres") && seriesNode.get("genres").isArray()) {
                // Detailed format - genres array with objects
                for (JsonNode genre : seriesNode.get("genres")) {
                    String genreName = genre.get("name") != null ? genre.get("name").asText() : "";
                    if (!genreName.isEmpty()) {
                        genres.add(genreName);
                    }
                }
            }
            
            // Parse networks - handle both summary and detailed formats
            List<String> networks = new ArrayList<>();
            if (seriesNode.has("networks") && seriesNode.get("networks").isArray()) {
                for (JsonNode network : seriesNode.get("networks")) {
                    String networkName = network.get("name") != null ? network.get("name").asText() : "";
                    if (!networkName.isEmpty()) {
                        networks.add(networkName);
                    }
                }
            }
            
            SeriesDto series = new SeriesDto(id, name, overview, posterPath, videoLink);
            series.setFirstAirDate(firstAirDate);
            series.setLastAirDate(lastAirDate);
            series.setVoteAverage(voteAverage);
            series.setVoteCount(voteCount);
            series.setNumberOfSeasons(numberOfSeasons);
            series.setNumberOfEpisodes(numberOfEpisodes);
            series.setStatus(status);
            series.setType(type);
            series.setGenres(genres);
            series.setNetworks(networks);
            
            return series;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Generate video link using vidsrc.to
     */
    private String generateVideoLink(Long seriesId) {
        if (seriesId == null) {
            return "";
        }
        return String.format("https://vidsrc.to/embed/tv/%d", seriesId);
    }
    
    /**
     * Get genre name by ID (simplified mapping)
     */
    private String getGenreName(int genreId) {
        switch (genreId) {
            case 10759: return "Action & Adventure";
            case 16: return "Animation";
            case 35: return "Comedy";
            case 80: return "Crime";
            case 99: return "Documentary";
            case 18: return "Drama";
            case 10751: return "Family";
            case 10762: return "Kids";
            case 9648: return "Mystery";
            case 10763: return "News";
            case 10764: return "Reality";
            case 10765: return "Sci-Fi & Fantasy";
            case 10766: return "Soap";
            case 10767: return "Talk";
            case 10768: return "War & Politics";
            case 37: return "Western";
            default: return "Other";
        }
    }
    
    /**
     * Get full poster URL
     */
    public String getFullPosterUrl(String posterPath) {
        if (posterPath == null || posterPath.isEmpty()) {
            return "";
        }
        return String.format("https://image.tmdb.org/t/p/w500%s", posterPath);
    }
} 