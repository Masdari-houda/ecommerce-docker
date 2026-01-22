package com.example.ecommerce.repository;

import com.example.ecommerce.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query(value = "SELECT * FROM carts WHERE user_id_string = :userId", nativeQuery = true)
    Optional<Cart> findByUserId(@Param("userId") String userId);
}
