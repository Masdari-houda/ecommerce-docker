package com.example.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "user_id_string", nullable = false)
    private String userId;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "cart")
    private List<CartItem> items = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column
    private LocalDateTime dateModification;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    @JsonIgnore
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }

    public void addItem(CartItem item) {
        for (CartItem existing : items) {
            if (existing.getProduct().getId().equals(item.getProduct().getId())) {
                existing.setQuantity(existing.getQuantity() + item.getQuantity());
                return;
            }
        }
        items.add(item);
        item.setCart(this);
    }

    public void removeItemByProductId(Long productId) {
        items.removeIf(i -> i.getProduct().getId().equals(productId));
    }

    public double getTotal() {
        return items.stream().mapToDouble(i -> i.getQuantity() * i.getProduct().getPrice()).sum();
    }

    public int getCount() {
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }
}