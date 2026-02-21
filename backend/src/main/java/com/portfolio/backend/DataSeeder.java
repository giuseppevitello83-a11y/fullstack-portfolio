package com.portfolio.backend;

import com.portfolio.backend.entity.Product;
import com.portfolio.backend.entity.User;
import com.portfolio.backend.repository.ProductRepository;
import com.portfolio.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Create admin user
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@portfolio.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build());

            // Create regular user
            userRepository.save(User.builder()
                    .username("mario")
                    .email("mario@example.com")
                    .password(passwordEncoder.encode("mario123"))
                    .role(User.Role.USER)
                    .build());

            log.info("✅ Users seeded: admin@portfolio.com / admin123");
        }

        if (productRepository.count() == 0) {
            productRepository.save(Product.builder()
                    .name("MacBook Pro M3")
                    .description("Laptop Apple da 14\" con chip M3, 16GB RAM, 512GB SSD")
                    .price(new BigDecimal("2299.00"))
                    .quantity(15)
                    .category("Electronics")
                    .build());

            productRepository.save(Product.builder()
                    .name("Nike Air Max 2024")
                    .description("Scarpe da running con ammortizzazione Air Max Next")
                    .price(new BigDecimal("189.99"))
                    .quantity(50)
                    .category("Footwear")
                    .build());

            productRepository.save(Product.builder()
                    .name("Samsung 4K OLED 55\"")
                    .description("Smart TV OLED Ultra HD con HDR10+ e Dolby Atmos")
                    .price(new BigDecimal("1499.00"))
                    .quantity(8)
                    .category("Electronics")
                    .build());

            productRepository.save(Product.builder()
                    .name("Sony WH-1000XM5")
                    .description("Cuffie wireless con cancellazione attiva del rumore leader di settore")
                    .price(new BigDecimal("349.00"))
                    .quantity(25)
                    .category("Electronics")
                    .build());

            productRepository.save(Product.builder()
                    .name("Dyson V15 Detect")
                    .description("Aspirapolvere senza filo con laser per rilevare polvere invisibile")
                    .price(new BigDecimal("749.00"))
                    .quantity(12)
                    .category("Home Appliances")
                    .build());

            productRepository.save(Product.builder()
                    .name("LEGO Technic Ferrari")
                    .description("Set tecnico Ferrari SF90 Stradale, 1677 pezzi")
                    .price(new BigDecimal("219.99"))
                    .quantity(30)
                    .category("Toys")
                    .build());

            log.info("✅ Products seeded: 6 sample products added");
        }
    }
}
