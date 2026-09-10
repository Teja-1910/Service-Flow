package com.smartshop.controller;

import com.smartshop.model.Reward;
import com.smartshop.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
@CrossOrigin(origins = "*")
public class RewardController {

    @Autowired
    private RewardRepository rewardRepository;

    @GetMapping
    public ResponseEntity<?> getRewardPoints(@RequestParam Long userId) {
        Reward reward = rewardRepository.findByUserId(userId)
                .orElseGet(() -> rewardRepository.save(new Reward(userId, 1250)));
        Map<String, Object> resp = new HashMap<>();
        resp.put("userId", userId);
        resp.put("points", reward.getPoints());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/redeem")
    public ResponseEntity<?> redeemPoints(@RequestBody Map<String, Object> req) {
        Long userId = Long.valueOf(req.get("userId").toString());
        Integer pointsToRedeem = Integer.valueOf(req.get("points").toString());

        Reward reward = rewardRepository.findByUserId(userId)
                .orElseGet(() -> new Reward(userId, 0));

        if (reward.getPoints() < pointsToRedeem) {
            return ResponseEntity.badRequest().body(Map.of("error", "Insufficient reward points balance."));
        }

        reward.setPoints(reward.getPoints() - pointsToRedeem);
        rewardRepository.save(reward);

        return ResponseEntity.ok(Map.of("remainingPoints", reward.getPoints(), "redeemed", pointsToRedeem));
    }
}
