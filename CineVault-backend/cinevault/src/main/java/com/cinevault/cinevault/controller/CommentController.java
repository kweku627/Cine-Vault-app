package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.Comment;
import com.cinevault.cinevault.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movies/{movieId}/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getComments(@PathVariable Long movieId) {
        return commentService.getCommentsByMovieId(movieId);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long movieId, @RequestBody Comment comment) {
        try {
            comment.setMovieId(movieId);
            Comment saved = commentService.addComment(comment);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 