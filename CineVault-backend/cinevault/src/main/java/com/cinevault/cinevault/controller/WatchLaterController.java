package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.dto.WatchLaterRequest;
import com.cinevault.cinevault.model.WatchLater;
import com.cinevault.cinevault.model.User;
import com.cinevault.cinevault.service.WatchLaterService;
import com.cinevault.cinevault.security.JwtUtil;
import com.cinevault.cinevault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/watch-later")
@CrossOrigin(origins = "*")
public class WatchLaterController {

    @Autowired
    private WatchLaterService watchLaterService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUserWatchLater(@RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("🔍 Processing watch-later request");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ No valid Authorization header");
                return ResponseEntity.status(401).body(Map.of("message", "No valid token provided"));
            }

            String token = authHeader.substring(7);
            System.out.println("🔍 Validating token: " + token.substring(0, Math.min(50, token.length())) + "...");
            
            if (!jwtUtil.validateToken(token)) {
                System.out.println("❌ Token validation failed");
                return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
            }
            
            System.out.println("✅ Token validation successful");

            // Extract user email from token and find user
            String email = jwtUtil.extractEmail(token);
            System.out.println("📧 Extracted email: " + email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("👤 Found user: " + user.getUsername() + " (ID: " + user.getId() + ")");

            List<WatchLater> watchLaterItems = watchLaterService.getUserWatchLater(user.getId());
            System.out.println("📋 Found " + watchLaterItems.size() + " watch-later items");
            
            return ResponseEntity.ok(watchLaterItems);
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error fetching watch later items: " + e.getMessage()));
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getUserWatchLaterByType(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String type) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "No valid token provided"));
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
            }

            // Extract user email from token and find user
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<WatchLater> watchLaterItems = watchLaterService.getUserWatchLaterByType(user.getId(), type);
            return ResponseEntity.ok(watchLaterItems);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error fetching watch later items: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addToWatchLater(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody WatchLaterRequest request) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "No valid token provided"));
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
            }

            // Extract user email from token and find user
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            WatchLater watchLater = watchLaterService.addToWatchLater(user.getId(), request);
            return ResponseEntity.status(201).body(watchLater);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error adding to watch later: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{contentId}")
    public ResponseEntity<?> removeFromWatchLater(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contentId) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "No valid token provided"));
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
            }

            // Extract user email from token and find user
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            watchLaterService.removeFromWatchLater(user.getId(), contentId);
            return ResponseEntity.ok(Map.of("message", "Removed from watch later"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error removing from watch later: " + e.getMessage()));
        }
    }

    @GetMapping("/check/{contentId}")
    public ResponseEntity<?> checkIfInWatchLater(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contentId) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "No valid token provided"));
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
            }

            // Extract user email from token and find user
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            boolean isInWatchLater = watchLaterService.isInWatchLater(user.getId(), contentId);
            return ResponseEntity.ok(Map.of("inWatchLater", isInWatchLater));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error checking watch later status: " + e.getMessage()));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getWatchLaterCount(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "No valid token provided"));
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
            }

            // Extract user email from token and find user
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            long count = watchLaterService.getWatchLaterCount(user.getId());
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error getting watch later count: " + e.getMessage()));
        }
    }
} 