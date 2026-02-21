package com.portfolio.backend.controller;

import com.portfolio.backend.entity.Order;
import com.portfolio.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getOrdersByUser(auth.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = Integer.parseInt(body.get("quantity").toString());
        Order order = orderService.createOrder(auth.getName(), productId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Order.Status status = Order.Status.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
