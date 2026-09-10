package com.smartshop.controller;

import com.smartshop.model.*;
import com.smartshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Order> getUserOrders(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        }
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            Map<String, Object> resp = new HashMap<>();
            resp.put("order", order);
            resp.put("items", items);
            return ResponseEntity.ok(resp);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> req) {
        Long userId = Long.valueOf(req.get("userId").toString());
        BigDecimal totalAmount = new BigDecimal(req.get("totalAmount").toString());
        String deliveryAddress = req.get("deliveryAddress") != null ? req.get("deliveryAddress").toString() : "";

        Order order = new Order(userId, totalAmount, "Confirmed", "Paid", deliveryAddress);
        Order savedOrder = orderRepository.save(order);

        // Earn loyalty points: 1 point per 10 rupees spent
        int pointsEarned = totalAmount.divide(BigDecimal.valueOf(10)).intValue();
        Reward reward = rewardRepository.findByUserId(userId)
                .orElseGet(() -> new Reward(userId, 0));
        reward.setPoints(reward.getPoints() + pointsEarned);
        rewardRepository.save(reward);

        // Record transaction
        Transaction txn = new Transaction(userId, totalAmount, "Retail Shopping", "Completed");
        transactionRepository.save(txn);

        Map<String, Object> resp = new HashMap<>();
        resp.put("orderId", savedOrder.getId());
        resp.put("status", savedOrder.getOrderStatus());
        resp.put("pointsEarned", pointsEarned);
        resp.put("message", "Order placed successfully");

        return ResponseEntity.ok(resp);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> req) {
        String newStatus = req.get("status");
        return orderRepository.findById(id).map(order -> {
            order.setOrderStatus(newStatus);
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }
}
