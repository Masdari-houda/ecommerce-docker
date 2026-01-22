package com.example.ecommerce.service;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    
    public Cart getCart(String userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.setUserId(userId);
            return cartRepository.save(c);
        });
    }

    public Cart addItem(String userId, Long productId, int quantity) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Cart cart = getCart(userId);
        cart.addItem(new CartItem(p, quantity));
        return cartRepository.save(cart);
    }

    public Cart addItemWithProduct(String userId, Product productInfo, int quantity) {
        Product p;
        if (productInfo.getId() != null) {
            p = productRepository.findById(productInfo.getId())
                    .orElseGet(() -> {
                        Product newProduct = new Product();
                        newProduct.setName(productInfo.getName());
                        newProduct.setDescription(productInfo.getDescription() != null ? productInfo.getDescription() : "");
                        newProduct.setPrice(productInfo.getPrice());
                        return productRepository.save(newProduct);
                    });
        } else {
            Product newProduct = new Product();
            newProduct.setName(productInfo.getName());
            newProduct.setDescription(productInfo.getDescription() != null ? productInfo.getDescription() : "");
            newProduct.setPrice(productInfo.getPrice());
            p = productRepository.save(newProduct);
        }
        
        Cart cart = getCart(userId);
        cart.addItem(new CartItem(p, quantity));
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String userId, Long productId, int quantity) {
        Cart cart = getCart(userId);
        cart.getItems().forEach(i -> {
            if (i.getProduct().getId().equals(productId)) i.setQuantity(quantity);
        });
        return cartRepository.save(cart);
    }

    public Cart removeItem(String userId, Long productId) {
        Cart cart = getCart(userId);
        cart.removeItemByProductId(productId);
        return cartRepository.save(cart);
    }

    public void clear(String userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}