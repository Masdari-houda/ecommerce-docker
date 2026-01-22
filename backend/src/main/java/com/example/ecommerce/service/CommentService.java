package com.example.ecommerce.service;

import com.example.ecommerce.model.Comment;
import com.example.ecommerce.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> getCommentsByProductId(Long productId) {
        return commentRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}

