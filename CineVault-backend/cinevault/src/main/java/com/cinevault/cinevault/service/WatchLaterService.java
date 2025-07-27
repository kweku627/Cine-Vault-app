package com.cinevault.cinevault.service;

import com.cinevault.cinevault.dto.WatchLaterRequest;
import com.cinevault.cinevault.model.User;
import com.cinevault.cinevault.model.WatchLater;
import com.cinevault.cinevault.repository.UserRepository;
import com.cinevault.cinevault.repository.WatchLaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WatchLaterService {

    @Autowired
    private WatchLaterRepository watchLaterRepository;

    @Autowired
    private UserRepository userRepository;

    public List<WatchLater> getUserWatchLater(Long userId) {
        return watchLaterRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<WatchLater> getUserWatchLaterByType(Long userId, String type) {
        return watchLaterRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
    }

    public WatchLater addToWatchLater(Long userId, WatchLaterRequest request) {
        // Check if user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        // Check if already in watch later
        if (watchLaterRepository.existsByUserIdAndContentId(userId, request.getContentId())) {
            throw new RuntimeException("Content already in watch later list");
        }

        // Create new watch later entry
        WatchLater watchLater = new WatchLater();
        watchLater.setUser(user);
        watchLater.setContentId(request.getContentId());
        watchLater.setTitle(request.getTitle());
        watchLater.setDescription(request.getDescription());
        watchLater.setPoster(request.getPoster());
        watchLater.setBackdrop(request.getBackdrop());
        watchLater.setYear(request.getYear());
        watchLater.setGenre(request.getGenre());
        watchLater.setType(request.getType());
        watchLater.setDuration(request.getDuration());
        watchLater.setRating(request.getRating());
        watchLater.setCreatedAt(java.time.LocalDateTime.now());

        return watchLaterRepository.save(watchLater);
    }

    public void removeFromWatchLater(Long userId, String contentId) {
        // Check if user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Check if content exists in watch later
        Optional<WatchLater> watchLaterOpt = watchLaterRepository.findByUserIdAndContentId(userId, contentId);
        if (watchLaterOpt.isEmpty()) {
            throw new RuntimeException("Content not found in watch later list");
        }

        watchLaterRepository.deleteByUserIdAndContentId(userId, contentId);
    }

    public boolean isInWatchLater(Long userId, String contentId) {
        return watchLaterRepository.existsByUserIdAndContentId(userId, contentId);
    }

    public long getWatchLaterCount(Long userId) {
        return watchLaterRepository.countByUserId(userId);
    }
} 