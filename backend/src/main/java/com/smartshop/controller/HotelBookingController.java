package com.smartshop.controller;

import com.smartshop.model.HotelBooking;
import com.smartshop.model.Reward;
import com.smartshop.model.Transaction;
import com.smartshop.repository.HotelBookingRepository;
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
@RequestMapping("/api/hotel-bookings")
@CrossOrigin(origins = "*")
public class HotelBookingController {

    @Autowired
    private HotelBookingRepository hotelBookingRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<HotelBooking> getUserHotelBookings(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return hotelBookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        }
        return hotelBookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createHotelBooking(@RequestBody HotelBooking booking) {
        HotelBooking saved = hotelBookingRepository.save(booking);

        // Loyalty points bonus for hotel stays: 1 point per 20 rupees
        int points = saved.getTotalAmount().divide(BigDecimal.valueOf(20)).intValue();
        Reward r = rewardRepository.findByUserId(saved.getUserId())
                .orElseGet(() -> new Reward(saved.getUserId(), 0));
        r.setPoints(r.getPoints() + points);
        rewardRepository.save(r);

        // Record transaction
        Transaction txn = new Transaction(saved.getUserId(), saved.getTotalAmount(), "Hotel Booking", "Completed");
        transactionRepository.save(txn);

        Map<String, Object> resp = new HashMap<>();
        resp.put("bookingId", saved.getId());
        resp.put("status", saved.getStatus());
        resp.put("pointsEarned", points);
        resp.put("message", "Hotel reservation confirmed successfully");

        return ResponseEntity.ok(resp);
    }
}
