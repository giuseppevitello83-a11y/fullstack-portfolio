package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProductDto;
import com.portfolio.backend.entity.Product;
import com.portfolio.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> search(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public Product create(ProductDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .build();
        return productRepository.save(product);
    }

    public Product update(Long id, ProductDto dto) {
        Product product = getById(id);
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }
}
