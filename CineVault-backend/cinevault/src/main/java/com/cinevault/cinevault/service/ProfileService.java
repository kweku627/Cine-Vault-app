package com.cinevault.cinevault.service;

import com.cinevault.cinevault.dto.ProfileRequest;
import com.cinevault.cinevault.dto.ProfileResponse;
import com.cinevault.cinevault.model.Profile;
import com.cinevault.cinevault.model.User;
import com.cinevault.cinevault.repository.ProfileRepository;
import com.cinevault.cinevault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new profile for a user
     */
    public ProfileResponse createProfile(Long userId, ProfileRequest request) {
        // Check if user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Check if user can create more profiles
        if (!profileRepository.canCreateProfile(userId)) {
            throw new RuntimeException("Maximum number of profiles (3) reached for this user");
        }

        // Check if profile name already exists for this user
        if (profileRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new RuntimeException("Profile name already exists for this user");
        }

        // Create new profile
        Profile profile = new Profile(
            userOpt.get(),
            request.getName(),
            request.getAvatarPath(),
            request.getIsKidsProfile()
        );

        Profile savedProfile = profileRepository.save(profile);
        return new ProfileResponse(savedProfile);
    }

    /**
     * Get all profiles for a user
     */
    public List<ProfileResponse> getUserProfiles(Long userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        List<Profile> profiles = profileRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtAsc(userId);
        return profiles.stream()
                .map(ProfileResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific profile by ID
     */
    public ProfileResponse getProfile(Long userId, Long profileId) {
        Optional<Profile> profileOpt = profileRepository.findByUserIdAndId(userId, profileId);
        
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found");
        }

        return new ProfileResponse(profileOpt.get());
    }

    /**
     * Update a profile
     */
    public ProfileResponse updateProfile(Long userId, Long profileId, ProfileRequest request) {
        Optional<Profile> profileOpt = profileRepository.findByUserIdAndId(userId, profileId);
        
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found");
        }

        Profile profile = profileOpt.get();

        // Check if new name conflicts with existing profiles (excluding current profile)
        if (!profile.getName().equals(request.getName()) && 
            profileRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new RuntimeException("Profile name already exists for this user");
        }

        // Update profile
        profile.setName(request.getName());
        if (request.getAvatarPath() != null) {
            profile.setAvatarPath(request.getAvatarPath());
        }
        if (request.getIsKidsProfile() != null) {
            profile.setIsKidsProfile(request.getIsKidsProfile());
        }
        profile.setUpdatedAt(LocalDateTime.now());

        Profile updatedProfile = profileRepository.save(profile);
        return new ProfileResponse(updatedProfile);
    }

    /**
     * Delete a profile (soft delete by setting isActive to false)
     */
    public void deleteProfile(Long userId, Long profileId) {
        Optional<Profile> profileOpt = profileRepository.findByUserIdAndId(userId, profileId);
        
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found");
        }

        Profile profile = profileOpt.get();
        
        // Check if this is the last profile
        long activeProfileCount = profileRepository.countByUserIdAndIsActiveTrue(userId);
        if (activeProfileCount <= 1) {
            throw new RuntimeException("Cannot delete the last profile. At least one profile must remain.");
        }

        // Soft delete
        profile.setIsActive(false);
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);
    }

    /**
     * Get default profile for user (first created active profile)
     */
    public ProfileResponse getDefaultProfile(Long userId) {
        List<Profile> defaultProfiles = profileRepository.findDefaultProfile(userId);
        
        if (defaultProfiles.isEmpty()) {
            throw new RuntimeException("No active profiles found for user");
        }

        return new ProfileResponse(defaultProfiles.get(0));
    }

    /**
     * Check if user can create more profiles
     */
    public boolean canCreateProfile(Long userId) {
        return profileRepository.canCreateProfile(userId);
    }

    /**
     * Get profile count for user
     */
    public long getProfileCount(Long userId) {
        return profileRepository.countByUserIdAndIsActiveTrue(userId);
    }

    /**
     * Validate profile belongs to user
     */
    public boolean validateProfileOwnership(Long userId, Long profileId) {
        return profileRepository.findByUserIdAndId(userId, profileId).isPresent();
    }
} 