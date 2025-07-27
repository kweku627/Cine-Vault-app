package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Find all feedback by user ID
    List<Feedback> findByUserIdOrderByTimestampDesc(Long userId);
    
    // Find all feedback by status
    List<Feedback> findByStatusOrderByTimestampDesc(Feedback.FeedbackStatus status);
    
    // Find all feedback by category
    List<Feedback> findByCategoryOrderByTimestampDesc(String category);
    
    // Find feedback by user ID and status
    List<Feedback> findByUserIdAndStatusOrderByTimestampDesc(Long userId, Feedback.FeedbackStatus status);
    
    // Count feedback by status
    long countByStatus(Feedback.FeedbackStatus status);
    
    // Count feedback by user ID
    long countByUserId(Long userId);
} 