package com.cinevault.cinevault.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;


@Service
public class VideoScraperService {
    
    private static final Logger logger = LoggerFactory.getLogger(VideoScraperService.class);
    
    // User agents to rotate to avoid detection
    private static final String[] USER_AGENTS = {
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0"
    };
    
    /**
     * Extract video URL using Jsoup (for static content)
     */
    public String extractVideoUrlWithJsoup(String movieId) {
        String embedUrl = "https://vidsrc.to/embed/movie/" + movieId;
        String userAgent = getRandomUserAgent();
        
        try {
            logger.info("Attempting to extract video URL with Jsoup for movie ID: {}", movieId);
            
            // Add delay to avoid rate limiting
            Thread.sleep(1000 + (long) (Math.random() * 2000));
            
            Document doc = Jsoup.connect(embedUrl)
                    .userAgent(userAgent)
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.5")
                    .header("Accept-Encoding", "gzip, deflate")
                    .header("Connection", "keep-alive")
                    .header("Upgrade-Insecure-Requests", "1")
                    .timeout(30000)
                    .get();
            
            // Look for video sources
            Elements videoElements = doc.select("video source");
            for (Element video : videoElements) {
                String src = video.attr("src");
                if (isValidVideoUrl(src)) {
                    logger.info("Found video URL with Jsoup: {}", src);
                    return src;
                }
            }
            
            // Look for iframes that might contain video
            Elements iframes = doc.select("iframe");
            for (Element iframe : iframes) {
                String src = iframe.attr("src");
                if (src.contains("m3u8") || src.contains(".mp4") || src.contains("blob:")) {
                    logger.info("Found iframe video URL with Jsoup: {}", src);
                    return src;
                }
            }
            
            // Look for script tags that might contain video URLs
            Elements scripts = doc.select("script");
            for (Element script : scripts) {
                String scriptContent = script.html();
                String videoUrl = extractVideoUrlFromScript(scriptContent);
                if (videoUrl != null) {
                    logger.info("Found video URL in script with Jsoup: {}", videoUrl);
                    return videoUrl;
                }
            }
            
            logger.warn("No video URL found with Jsoup for movie ID: {}", movieId);
            return null;
            
        } catch (IOException | InterruptedException e) {
            logger.error("Error extracting video URL with Jsoup for movie ID {}: {}", movieId, e.getMessage());
            return null;
        }
    }
    

    
    /**
     * Main method to extract video URL using Jsoup
     */
    public String extractVideoUrl(String movieId) {
        logger.info("Starting video URL extraction for movie ID: {}", movieId);
        
        // Try Jsoup (simpler approach without Selenium)
        String videoUrl = extractVideoUrlWithJsoup(movieId);
        
        return videoUrl;
    }
    
    /**
     * Extract video URL from script content
     */
    private String extractVideoUrlFromScript(String scriptContent) {
        // Look for common patterns in video URLs
        String[] patterns = {
            "https://[^\"']*\\.m3u8[^\"']*",
            "https://[^\"']*\\.mp4[^\"']*",
            "blob:https://[^\"']*",
            "src\\s*:\\s*['\"]([^'\"]*\\.(?:m3u8|mp4))['\"]",
            "url\\s*:\\s*['\"]([^'\"]*\\.(?:m3u8|mp4))['\"]"
        };
        
        for (String pattern : patterns) {
            java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern, java.util.regex.Pattern.CASE_INSENSITIVE);
            java.util.regex.Matcher m = p.matcher(scriptContent);
            if (m.find()) {
                return m.group(0);
            }
        }
        
        return null;
    }
    

    
    /**
     * Check if a URL is a valid video URL
     */
    private boolean isValidVideoUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        
        return url.contains(".m3u8") || 
               url.contains(".mp4") || 
               url.contains("blob:") ||
               url.contains("video") ||
               url.contains("stream");
    }
    
    /**
     * Get a random user agent to avoid detection
     */
    private String getRandomUserAgent() {
        int index = (int) (Math.random() * USER_AGENTS.length);
        return USER_AGENTS[index];
    }
    
    /**
     * Get embed URL for a movie (fallback when direct video extraction fails)
     */
    public String getEmbedUrl(String movieId) {
        return "https://vidsrc.to/embed/movie/" + movieId;
    }
} 