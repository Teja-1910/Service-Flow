package com.smartshop.controller;

import com.smartshop.model.EventBooking;
import com.smartshop.model.Reward;
import com.smartshop.model.Transaction;
import com.smartshop.repository.EventBookingRepository;
import com.smartshop.repository.RewardRepository;
import com.smartshop.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/event-bookings")
@CrossOrigin(origins = "*")
public class EventBookingController {

    @Autowired
    private EventBookingRepository eventBookingRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<EventBooking> getUserEventBookings(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return eventBookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        }
        return eventBookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createEventBooking(@RequestBody EventBooking booking) {
        EventBooking saved = eventBookingRepository.save(booking);

        // Loyalty points bonus for entertainment: 1 point per 15 rupees
        int points = saved.getTotalAmount().divide(BigDecimal.valueOf(15)).intValue();
        Reward r = rewardRepository.findByUserId(saved.getUserId())
                .orElseGet(() -> new Reward(saved.getUserId(), 0));
        r.setPoints(r.getPoints() + points);
        rewardRepository.save(r);

        // Record transaction
        Transaction txn = new Transaction(saved.getUserId(), saved.getTotalAmount(), "Entertainment Ticket", "Completed");
        transactionRepository.save(txn);

        Map<String, Object> resp = new HashMap<>();
        resp.put("bookingId", saved.getId());
        resp.put("status", saved.getBookingStatus());
        resp.put("pointsEarned", points);
        resp.put("message", "Entertainment tickets reserved successfully");

        return ResponseEntity.ok(resp);
    }
}
