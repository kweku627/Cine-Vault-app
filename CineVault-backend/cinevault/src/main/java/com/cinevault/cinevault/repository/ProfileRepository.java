package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
    // Find all profiles for a specific user
    List<Profile> findByUserIdOrderByCreatedAtAsc(Long userId);
    
    // Find active profiles for a user
    List<Profile> findByUserIdAndIsActiveTrueOrderByCreatedAtAsc(Long userId);
    
    // Find a specific profile by user and profile name
    Optional<Profile> findByUserIdAndName(Long userId, String name);
    
    // Check if profile name exists for a user
    boolean existsByUserIdAndName(Long userId, String name);
    
    // Count profiles for a user
    long countByUserId(Long userId);
    
    // Count active profiles for a user
    long countByUserIdAndIsActiveTrue(Long userId);
    
    // Find profile by user ID and profile ID
    Optional<Profile> findByUserIdAndId(Long userId, Long profileId);
    
    // Check if user can create more profiles (max 3)
    @Query("SELECT COUNT(p) < 3 FROM Profile p WHERE p.user.id = :userId AND p.isActive = true")
    boolean canCreateProfile(@Param("userId") Long userId);
    
    // Find default profile for user (first created)
    @Query("SELECT p FROM Profile p WHERE p.user.id = :userId AND p.isActive = true ORDER BY p.createdAt ASC")
    List<Profile> findDefaultProfile(@Param("userId") Long userId);
} 