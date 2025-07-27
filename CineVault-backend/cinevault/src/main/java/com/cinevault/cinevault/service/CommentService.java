package com.cinevault.cinevault.service;

import com.cinevault.cinevault.model.Comment;
import com.cinevault.cinevault.repository.CommentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> getCommentsByMovieId(Long movieId) {
        return commentRepository.findByMovieId(movieId);
    }

    public Comment addComment(Comment comment) {
        if (comment.getMovieId() == null || comment.getCommenterName() == null || comment.getText() == null) {
            throw new IllegalArgumentException("Movie ID, commenter name, and text are required");
        }
        return commentRepository.save(comment);
    }
} 