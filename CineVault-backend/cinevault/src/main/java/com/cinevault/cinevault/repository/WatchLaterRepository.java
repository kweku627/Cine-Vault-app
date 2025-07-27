package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.WatchLater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchLaterRepository extends JpaRepository<WatchLater, Long> {
    
    // Find all watch later items for a specific user
    List<WatchLater> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find a specific watch later item by user and content ID
    Optional<WatchLater> findByUserIdAndContentId(Long userId, String contentId);
    
    // Check if a content is already in user's watch later list
    boolean existsByUserIdAndContentId(Long userId, String contentId);
    
    // Delete a specific watch later item by user and content ID
    void deleteByUserIdAndContentId(Long userId, String contentId);
    
    // Find watch later items by user and content type
    List<WatchLater> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, String type);
    
    // Count watch later items for a user
    long countByUserId(Long userId);
} 