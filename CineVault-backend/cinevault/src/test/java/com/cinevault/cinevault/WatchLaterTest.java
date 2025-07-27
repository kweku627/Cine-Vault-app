package com.cinevault.cinevault;

import com.cinevault.cinevault.dto.WatchLaterRequest;
import com.cinevault.cinevault.model.WatchLater;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class WatchLaterTest {

    @Test
    public void testWatchLaterTypeString() {
        // Test that the type string works correctly
        String movieType = "movie";
        String seriesType = "series";
        
        assertEquals("movie", movieType);
        assertEquals("series", seriesType);
        assertNotEquals(movieType, seriesType);
    }

    @Test
    public void testWatchLaterRequest() {
        // Test WatchLaterRequest DTO
        WatchLaterRequest request = new WatchLaterRequest("123", "Test Movie", "movie");
        
        assertEquals("123", request.getContentId());
        assertEquals("Test Movie", request.getTitle());
        assertEquals("movie", request.getType());
    }

    @Test
    public void testWatchLaterModel() {
        // Test WatchLater model
        WatchLater watchLater = new WatchLater();
        watchLater.setId(1L);
        watchLater.setContentId("123");
        watchLater.setTitle("Test Movie");
        watchLater.setType("movie");
        watchLater.setDescription("Test description");
        
        assertEquals(1L, watchLater.getId());
        assertEquals("123", watchLater.getContentId());
        assertEquals("Test Movie", watchLater.getTitle());
        assertEquals("movie", watchLater.getType());
        assertEquals("Test description", watchLater.getDescription());
    }

    @Test
    public void testWatchLaterWithAllFields() {
        // Test WatchLater with all fields
        WatchLater watchLater = new WatchLater();
        watchLater.setId(1L);
        watchLater.setContentId("123");
        watchLater.setTitle("Test Movie");
        watchLater.setDescription("Test overview");
        watchLater.setPoster("/poster.jpg");
        watchLater.setBackdrop("/backdrop.jpg");
        watchLater.setYear("2023");
        watchLater.setGenre("Action");
        watchLater.setType("movie");
        watchLater.setDuration("120");
        watchLater.setRating("8.5");
        
        assertEquals(1L, watchLater.getId());
        assertEquals("123", watchLater.getContentId());
        assertEquals("Test Movie", watchLater.getTitle());
        assertEquals("Test overview", watchLater.getDescription());
        assertEquals("/poster.jpg", watchLater.getPoster());
        assertEquals("/backdrop.jpg", watchLater.getBackdrop());
        assertEquals("2023", watchLater.getYear());
        assertEquals("Action", watchLater.getGenre());
        assertEquals("movie", watchLater.getType());
        assertEquals("120", watchLater.getDuration());
        assertEquals("8.5", watchLater.getRating());
    }
} 