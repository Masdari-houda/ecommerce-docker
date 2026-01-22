package com.example.ecommerce.controller;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public Cart getCart(@RequestParam(required = false) String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId is required");
        }
        return cartService.getCart(userId);
    }

    @PostMapping("/items")
    public Cart addItem(@RequestParam(required = false) Long productId, 
                        @RequestParam(defaultValue = "1") int quantity,
                        @RequestParam(required = false) String userId,
                        @RequestBody(required = false) com.example.ecommerce.model.Product productInfo) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId is required");
        }
        
        if (productInfo != null && productInfo.getName() != null) {
            // Si les informations du produit sont fournies, créer ou utiliser le produit
            return cartService.addItemWithProduct(userId, productInfo, quantity);
        } else if (productId != null) {
            // Mode classique avec productId
            return cartService.addItem(userId, productId, quantity);
        } else {
            throw new IllegalArgumentException("Either productId or product information must be provided");
        }
    }

    @PutMapping("/items/{productId}")
    public Cart updateItem(@PathVariable Long productId, 
                          @RequestParam int quantity,
                          @RequestParam(required = false) String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId is required");
        }
        return cartService.updateQuantity(userId, productId, quantity);
    }

    @DeleteMapping("/items/{productId}")
    public Cart removeItem(@PathVariable Long productId,
                           @RequestParam(required = false) String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId is required");
        }
        return cartService.removeItem(userId, productId);
    }

    @PostMapping("/clear")
    public ResponseEntity<Void> clear(@RequestParam(required = false) String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId is required");
        }
        cartService.clear(userId);
        return ResponseEntity.noContent().build();
    }
}