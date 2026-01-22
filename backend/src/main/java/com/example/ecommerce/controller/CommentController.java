package com.example.ecommerce.controller;

import com.example.ecommerce.model.Comment;
import com.example.ecommerce.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/product/{productId}")
    public List<Comment> getCommentsByProduct(@PathVariable Long productId) {
        return commentService.getCommentsByProductId(productId);
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        Comment saved = commentService.createComment(comment);
        return ResponseEntity.created(URI.create("/api/comments/" + saved.getId())).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}

