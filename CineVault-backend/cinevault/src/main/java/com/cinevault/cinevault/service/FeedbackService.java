package com.cinevault.cinevault.service;

import com.cinevault.cinevault.dto.FeedbackRequest;
import com.cinevault.cinevault.model.Feedback;
import com.cinevault.cinevault.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // Create new feedback
    public Feedback createFeedback(Long userId, FeedbackRequest request) {
        Feedback feedback = new Feedback(
            userId,
            request.getMessage(),
            request.getCategory(),
            request.getRating()
        );
        return feedbackRepository.save(feedback);
    }

    // Get all feedback
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // Get feedback by ID
    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    // Get feedback by user ID
    public List<Feedback> getFeedbackByUserId(Long userId) {
        return feedbackRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    // Get feedback by status
    public List<Feedback> getFeedbackByStatus(Feedback.FeedbackStatus status) {
        return feedbackRepository.findByStatusOrderByTimestampDesc(status);
    }

    // Get feedback by category
    public List<Feedback> getFeedbackByCategory(String category) {
        return feedbackRepository.findByCategoryOrderByTimestampDesc(category);
    }

    // Update feedback status
    public Feedback updateFeedbackStatus(Long id, Feedback.FeedbackStatus status) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(id);
        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();
            feedback.setStatus(status);
            return feedbackRepository.save(feedback);
        }
        throw new RuntimeException("Feedback not found with id: " + id);
    }

    // Update feedback
    public Feedback updateFeedback(Long id, FeedbackRequest request) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(id);
        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();
            feedback.setMessage(request.getMessage());
            if (request.getCategory() != null) {
                feedback.setCategory(request.getCategory());
            }
            if (request.getRating() != null) {
                feedback.setRating(request.getRating());
            }
            return feedbackRepository.save(feedback);
        }
        throw new RuntimeException("Feedback not found with id: " + id);
    }

    // Delete feedback
    public void deleteFeedback(Long id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
        } else {
            throw new RuntimeException("Feedback not found with id: " + id);
        }
    }

    // Get feedback statistics
    public long getFeedbackCountByStatus(Feedback.FeedbackStatus status) {
        return feedbackRepository.countByStatus(status);
    }

    public long getFeedbackCountByUserId(Long userId) {
        return feedbackRepository.countByUserId(userId);
    }

    // Get pending feedback count
    public long getPendingFeedbackCount() {
        return feedbackRepository.countByStatus(Feedback.FeedbackStatus.PENDING);
    }
} 