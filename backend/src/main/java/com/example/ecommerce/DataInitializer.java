package com.example.ecommerce;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            Product p1 = new Product("Laptop", "Ordinateur portable haute performance", 999.99, "Électronique", 10);
            p1.setThumbnail("https://via.placeholder.com/200?text=Laptop");
            productRepository.save(p1);

            Product p2 = new Product("Souris", "Souris sans fil", 29.99, "Accessoires", 50);
            p2.setThumbnail("https://via.placeholder.com/200?text=Mouse");
            productRepository.save(p2);

            Product p3 = new Product("Clavier", "Clavier mécanique RGB", 89.99, "Accessoires", 30);
            p3.setThumbnail("https://via.placeholder.com/200?text=Keyboard");
            productRepository.save(p3);

            Product p4 = new Product("Monitor", "Écran 27 pouces 4K", 399.99, "Électronique", 15);
            p4.setThumbnail("https://via.placeholder.com/200?text=Monitor");
            productRepository.save(p4);

            Product p5 = new Product("Casque", "Casque audio Bluetooth", 149.99, "Audio", 25);
            p5.setThumbnail("https://via.placeholder.com/200?text=Headphones");
            productRepository.save(p5);

            Product p6 = new Product("Webcam", "Webcam Full HD", 79.99, "Accessoires", 20);
            p6.setThumbnail("https://via.placeholder.com/200?text=Webcam");
            productRepository.save(p6);

            Product p7 = new Product("USB Hub", "Hub USB 3.0", 39.99, "Accessoires", 40);
            p7.setThumbnail("https://via.placeholder.com/200?text=USB+Hub");
            productRepository.save(p7);

            Product p8 = new Product("Stand Portable", "Support pour ordinateur", 49.99, "Accessoires", 35);
            p8.setThumbnail("https://via.placeholder.com/200?text=Stand");
            productRepository.save(p8);
        }
    }
}
