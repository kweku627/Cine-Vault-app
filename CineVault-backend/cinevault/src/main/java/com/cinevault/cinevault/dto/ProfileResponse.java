package com.cinevault.cinevault.dto;

import com.cinevault.cinevault.model.Profile;
import java.time.LocalDateTime;

public class ProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String avatarPath;
    private Boolean isKidsProfile;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public ProfileResponse() {}

    public ProfileResponse(Profile profile) {
        this.id = profile.getId();
        this.userId = profile.getUser() != null ? profile.getUser().getId() : null;
        this.name = profile.getName();
        this.avatarPath = profile.getAvatarPath();
        this.isKidsProfile = profile.getIsKidsProfile();
        this.isActive = profile.getIsActive();
        this.createdAt = profile.getCreatedAt();
        this.updatedAt = profile.getUpdatedAt();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatarPath() {
        return avatarPath;
    }

    public void setAvatarPath(String avatarPath) {
        this.avatarPath = avatarPath;
    }

    public Boolean getIsKidsProfile() {
        return isKidsProfile;
    }

    public void setIsKidsProfile(Boolean isKidsProfile) {
        this.isKidsProfile = isKidsProfile;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "ProfileResponse{" +
                "id=" + id +
                ", userId=" + userId +
                ", name='" + name + '\'' +
                ", avatarPath='" + avatarPath + '\'' +
                ", isKidsProfile=" + isKidsProfile +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 