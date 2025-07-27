package com.cinevault.cinevault;

import com.cinevault.cinevault.model.Series;
import com.cinevault.cinevault.model.Episode;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SeriesEpisodeTest {

    @Test
    public void testSeriesWithEpisodes() {
        // Create a series
        Series series = new Series();
        series.setSeriesId(1L);
        series.setTitle("Test Series");
        series.setOverview("A test series for unit testing");

        // Create episodes
        Episode episode1 = new Episode(1, 1, "Pilot", "The first episode", LocalDate.of(2023, 1, 1), "http://example.com/ep1");
        Episode episode2 = new Episode(1, 2, "Second Episode", "The second episode", LocalDate.of(2023, 1, 8), "http://example.com/ep2");
        Episode episode3 = new Episode(2, 1, "Season 2 Premiere", "The first episode of season 2", LocalDate.of(2024, 1, 1), "http://example.com/s2ep1");

        // Add episodes to series
        series.addEpisode(episode1);
        series.addEpisode(episode2);
        series.addEpisode(episode3);

        // Test basic functionality
        assertEquals(3, series.getTotalEpisodes());
        assertEquals(2, series.getTotalSeasons());

        // Test finding specific episodes
        Episode foundEpisode = series.findEpisode(1, 1);
        assertNotNull(foundEpisode);
        assertEquals("Pilot", foundEpisode.getTitle());

        // Test getting episodes by season
        List<Episode> season1Episodes = series.getEpisodesBySeason(1);
        assertEquals(2, season1Episodes.size());

        List<Episode> season2Episodes = series.getEpisodesBySeason(2);
        assertEquals(1, season2Episodes.size());

        // Test removing an episode
        series.removeEpisode(episode1);
        assertEquals(2, series.getTotalEpisodes());
        assertNull(series.findEpisode(1, 1));
    }

    @Test
    public void testEpisodeEquality() {
        Episode episode1 = new Episode(1, 1, "Test Episode", "Test overview", LocalDate.now(), "http://test.com");
        Episode episode2 = new Episode(1, 1, "Different Title", "Different overview", LocalDate.now(), "http://different.com");
        Episode episode3 = new Episode(1, 2, "Test Episode", "Test overview", LocalDate.now(), "http://test.com");

        // Episodes with same season and episode number should be equal
        assertEquals(episode1, episode2);
        
        // Episodes with different episode numbers should not be equal
        assertNotEquals(episode1, episode3);
    }

    @Test
    public void testEpisodeConstructor() {
        LocalDate releaseDate = LocalDate.of(2023, 5, 15);
        Episode episode = new Episode(1, 5, "Test Episode", "Test overview", releaseDate, "http://test.com");

        assertEquals(Integer.valueOf(1), episode.getSeasonNumber());
        assertEquals(Integer.valueOf(5), episode.getEpisodeNumber());
        assertEquals("Test Episode", episode.getTitle());
        assertEquals("Test overview", episode.getOverview());
        assertEquals(releaseDate, episode.getReleaseDate());
        assertEquals("http://test.com", episode.getVideoUrl());
    }

    @Test
    public void testSeriesWithNoEpisodes() {
        Series series = new Series();
        series.setSeriesId(1L);
        series.setTitle("Empty Series");

        assertEquals(0, series.getTotalEpisodes());
        assertEquals(0, series.getTotalSeasons());
        assertTrue(series.getEpisodesBySeason(1).isEmpty());
        assertNull(series.findEpisode(1, 1));
    }
} 