package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.dto.ProfileRequest;
import com.cinevault.cinevault.dto.ProfileResponse;
import com.cinevault.cinevault.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /**
     * Create a new profile for a user
     */
    @PostMapping
    public ResponseEntity<?> createProfile(
            @RequestParam(defaultValue = "1") Long userId,
            @Valid @RequestBody ProfileRequest request,
            BindingResult bindingResult) {
        
        // Validate request
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProfileResponse response = profileService.createProfile(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get all profiles for a user
     */
    @GetMapping
    public ResponseEntity<?> getUserProfiles(@RequestParam(defaultValue = "1") Long userId) {
        try {
            List<ProfileResponse> profiles = profileService.getUserProfiles(userId);
            return ResponseEntity.ok(profiles);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get a specific profile by ID
     */
    @GetMapping("/{profileId}")
    public ResponseEntity<?> getProfile(
            @RequestParam(defaultValue = "1") Long userId,
            @PathVariable Long profileId) {
        
        try {
            ProfileResponse profile = profileService.getProfile(userId, profileId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Update a profile
     */
    @PutMapping("/{profileId}")
    public ResponseEntity<?> updateProfile(
            @RequestParam(defaultValue = "1") Long userId,
            @PathVariable Long profileId,
            @Valid @RequestBody ProfileRequest request,
            BindingResult bindingResult) {
        
        // Validate request
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProfileResponse response = profileService.updateProfile(userId, profileId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Delete a profile
     */
    @DeleteMapping("/{profileId}")
    public ResponseEntity<?> deleteProfile(
            @RequestParam(defaultValue = "1") Long userId,
            @PathVariable Long profileId) {
        
        try {
            profileService.deleteProfile(userId, profileId);
            return ResponseEntity.ok().body(Map.of("message", "Profile deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get default profile for user
     */
    @GetMapping("/default")
    public ResponseEntity<?> getDefaultProfile(@RequestParam(defaultValue = "1") Long userId) {
        try {
            ProfileResponse profile = profileService.getDefaultProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Check if user can create more profiles
     */
    @GetMapping("/can-create")
    public ResponseEntity<?> canCreateProfile(@RequestParam(defaultValue = "1") Long userId) {
        boolean canCreate = profileService.canCreateProfile(userId);
        return ResponseEntity.ok(Map.of("canCreate", canCreate));
    }

    /**
     * Get profile count for user
     */
    @GetMapping("/count")
    public ResponseEntity<?> getProfileCount(@RequestParam(defaultValue = "1") Long userId) {
        long count = profileService.getProfileCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }
} 