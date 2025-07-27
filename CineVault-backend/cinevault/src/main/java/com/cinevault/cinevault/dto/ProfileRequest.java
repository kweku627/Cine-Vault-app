package com.cinevault.cinevault.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProfileRequest {
    @NotNull(message = "Profile name is required")
    @Size(min = 1, max = 50, message = "Profile name must be between 1 and 50 characters")
    private String name;
    
    private String avatarPath;
    
    private Boolean isKidsProfile = false;

    // Constructors
    public ProfileRequest() {}

    public ProfileRequest(String name) {
        this.name = name;
    }

    public ProfileRequest(String name, String avatarPath, Boolean isKidsProfile) {
        this.name = name;
        this.avatarPath = avatarPath;
        this.isKidsProfile = isKidsProfile;
    }

    // Getters and setters
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

    @Override
    public String toString() {
        return "ProfileRequest{" +
                "name='" + name + '\'' +
                ", avatarPath='" + avatarPath + '\'' +
                ", isKidsProfile=" + isKidsProfile +
                '}';
    }
} 