package com.cinevault.cinevault.service;

import com.cinevault.cinevault.dto.MovieDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class TmdbMovieService {
    
    @Value("${tmdb.api.key:your_tmdb_api_key_here}")
    private String tmdbApiKey;
    
    @Value("${tmdb.base.url:https://api.themoviedb.org/3}")
    private String tmdbBaseUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public TmdbMovieService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Fetch popular movies from TMDB API
     */
    public List<MovieDto> getPopularMovies(int page) {
        try {
            String url = String.format("%s/discover/movie?api_key=%s&sort_by=popularity.desc&page=%d", 
                tmdbBaseUrl, tmdbApiKey, page);
            
            System.out.println("TMDB API URL: " + url.replace(tmdbApiKey, "***API_KEY_HIDDEN***"));
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<MovieDto> movies = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode movieNode : resultsNode) {
                        MovieDto movie = parseMovieFromJson(movieNode);
                        if (movie != null) {
                            movies.add(movie);
                        }
                    }
                }
                
                System.out.println("TMDB API returned " + movies.size() + " popular movies");
                return movies;
            } else {
                System.out.println("TMDB API request failed with status: " + response.getStatusCode());
                if (response.getBody() != null) {
                    System.out.println("TMDB API response: " + response.getBody());
                }
            }
        } catch (Exception e) {
            System.out.println("TMDB API error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Fetch trending movies from TMDB API
     */
    public List<MovieDto> getTrendingMovies(int page) {
        try {
            String url = String.format("%s/trending/movie/week?api_key=%s&page=%d", 
                tmdbBaseUrl, tmdbApiKey, page);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<MovieDto> movies = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode movieNode : resultsNode) {
                        MovieDto movie = parseMovieFromJson(movieNode);
                        if (movie != null) {
                            movies.add(movie);
                        }
                    }
                }
                
                return movies;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Search movies by title
     */
    public List<MovieDto> searchMovies(String query, int page) {
        try {
            String encodedQuery = java.net.URLEncoder.encode(query, "UTF-8");
            String url = String.format("%s/search/movie?api_key=%s&query=%s&page=%d", 
                tmdbBaseUrl, tmdbApiKey, encodedQuery, page);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<MovieDto> movies = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode movieNode : resultsNode) {
                        MovieDto movie = parseMovieFromJson(movieNode);
                        if (movie != null) {
                            movies.add(movie);
                        }
                    }
                }
                
                return movies;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Get movies by genre
     */
    public List<MovieDto> getMoviesByGenre(int genreId, int page) {
        try {
            String url = String.format("%s/discover/movie?api_key=%s&with_genres=%d&sort_by=popularity.desc&page=%d", 
                tmdbBaseUrl, tmdbApiKey, genreId, page);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultsNode = rootNode.get("results");
                
                List<MovieDto> movies = new ArrayList<>();
                
                if (resultsNode != null && resultsNode.isArray()) {
                    for (JsonNode movieNode : resultsNode) {
                        MovieDto movie = parseMovieFromJson(movieNode);
                        if (movie != null) {
                            movies.add(movie);
                        }
                    }
                }
                
                return movies;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Parse movie data from TMDB JSON response
     */
    private MovieDto parseMovieFromJson(JsonNode movieNode) {
        try {
            Long id = movieNode.get("id") != null ? movieNode.get("id").asLong() : null;
            String title = movieNode.get("title") != null ? movieNode.get("title").asText() : "";
            String overview = movieNode.get("overview") != null ? movieNode.get("overview").asText() : "";
            String posterPath = movieNode.get("poster_path") != null ? movieNode.get("poster_path").asText() : "";
            String releaseDate = movieNode.get("release_date") != null ? movieNode.get("release_date").asText() : "";
            Double voteAverage = movieNode.get("vote_average") != null ? movieNode.get("vote_average").asDouble() : 0.0;
            Integer voteCount = movieNode.get("vote_count") != null ? movieNode.get("vote_count").asInt() : 0;
            
            // Generate video link using vidsrc.to
            String videoLink = generateVideoLink(id);
            
            // Get genre names if available
            String genre = "";
            if (movieNode.has("genre_ids") && movieNode.get("genre_ids").isArray()) {
                // For now, we'll just use the first genre ID
                // In a full implementation, you'd want to fetch genre names from a separate endpoint
                genre = "Action"; // Placeholder
            }
            
            MovieDto movie = new MovieDto(id, title, overview, posterPath, videoLink);
            movie.setReleaseDate(releaseDate);
            movie.setVoteAverage(voteAverage);
            movie.setVoteCount(voteCount);
            movie.setGenre(genre);
            
            return movie;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Generate video link using vidsrc.to
     */
    private String generateVideoLink(Long movieId) {
        if (movieId == null) {
            return "";
        }
        return String.format("https://vidsrc.to/embed/movie/%d", movieId);
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