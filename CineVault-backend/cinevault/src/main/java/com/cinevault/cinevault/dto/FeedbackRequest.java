package com.cinevault.cinevault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FeedbackRequest {
    @NotBlank(message = "Message is required")
    @Size(min = 1, max = 1000, message = "Message must be between 1 and 1000 characters")
    private String message;

    private String category;

    private Integer rating;

    // Constructors
    public FeedbackRequest() {}

    public FeedbackRequest(String message) {
        this.message = message;
    }

    public FeedbackRequest(String message, String category, Integer rating) {
        this.message = message;
        this.category = category;
        this.rating = rating;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
} 