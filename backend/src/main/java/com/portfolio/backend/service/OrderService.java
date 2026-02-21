package com.portfolio.backend.service;

import com.portfolio.backend.entity.Order;
import com.portfolio.backend.entity.Product;
import com.portfolio.backend.entity.User;
import com.portfolio.backend.repository.OrderRepository;
import com.portfolio.backend.repository.ProductRepository;
import com.portfolio.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<Order> getOrdersByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(String email, Long productId, int quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getQuantity());
        }

        // Decrease stock
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);

        BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));

        Order order = Order.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .totalPrice(totalPrice)
                .status(Order.Status.PENDING)
                .build();

        return orderRepository.save(order);
    }

    public Order updateStatus(Long orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
