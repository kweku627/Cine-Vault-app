package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.dto.FeedbackRequest;
import com.cinevault.cinevault.model.Feedback;
import com.cinevault.cinevault.model.User;
import com.cinevault.cinevault.repository.UserRepository;
import com.cinevault.cinevault.security.JwtUtil;
import com.cinevault.cinevault.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // Create new feedback
    @PostMapping
    public ResponseEntity<?> createFeedback(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody FeedbackRequest request,
            BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            // Extract user ID from auth header
            Long userId = extractUserIdFromToken(authHeader);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or missing authentication"));
            }

            Feedback feedback = feedbackService.createFeedback(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to create feedback: " + e.getMessage()));
        }
    }

    // Get all feedback (admin only)
    @GetMapping
    public ResponseEntity<?> getAllFeedback() {
        try {
            List<Feedback> feedback = feedbackService.getAllFeedback();
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to retrieve feedback: " + e.getMessage()));
        }
    }

    // Get feedback by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable Long id) {
        try {
            return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to retrieve feedback: " + e.getMessage()));
        }
    }

    // Get feedback by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFeedbackByUserId(@PathVariable Long userId) {
        try {
            List<Feedback> feedback = feedbackService.getFeedbackByUserId(userId);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to retrieve user feedback: " + e.getMessage()));
        }
    }

    // Get feedback by status
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getFeedbackByStatus(@PathVariable String status) {
        try {
            Feedback.FeedbackStatus feedbackStatus = Feedback.FeedbackStatus.valueOf(status.toUpperCase());
            List<Feedback> feedback = feedbackService.getFeedbackByStatus(feedbackStatus);
            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid status: " + status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to retrieve feedback: " + e.getMessage()));
        }
    }

    // Get feedback by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getFeedbackByCategory(@PathVariable String category) {
        try {
            List<Feedback> feedback = feedbackService.getFeedbackByCategory(category);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to retrieve feedback: " + e.getMessage()));
        }
    }

    // Update feedback status (admin only)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFeedbackStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        try {
            String statusStr = request.get("status");
            if (statusStr == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Status is required"));
            }

            Feedback.FeedbackStatus status = Feedback.FeedbackStatus.valueOf(statusStr.toUpperCase());
            Feedback feedback = feedbackService.updateFeedbackStatus(id, status);
            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to update feedback status: " + e.getMessage()));
        }
    }

    // Update feedback
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest request,
            BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            Feedback feedback = feedbackService.updateFeedback(id, request);
            return ResponseEntity.ok(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to update feedback: " + e.getMessage()));
        }
    }

    // Delete feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete feedback: " + e.getMessage()));
        }
    }

    // Get feedback statistics
    @GetMapping("/stats/pending")
    public ResponseEntity<?> getPendingFeedbackCount() {
        try {
            long count = feedbackService.getPendingFeedbackCount();
            return ResponseEntity.ok(Map.of("pendingCount", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to get statistics: " + e.getMessage()));
        }
    }

    // Helper method to extract user ID from JWT token
    private Long extractUserIdFromToken(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return null;
            }

            String token = authHeader.substring(7); // Remove "Bearer "
            if (!jwtUtil.validateToken(token)) {
                return null;
            }

            String email = jwtUtil.extractEmail(token);
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            return userOpt.map(User::getId).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }
} 