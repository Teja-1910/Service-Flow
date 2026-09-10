package com.smartshop.controller;

import com.smartshop.model.Wishlist;
import com.smartshop.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @GetMapping
    public List<Wishlist> getUserWishlist(@RequestParam Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWishlist(@RequestBody Map<String, Long> req) {
        Long userId = req.get("userId");
        Long productId = req.get("productId");

        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        Map<String, Object> resp = new HashMap<>();

        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            resp.put("action", "removed");
            resp.put("status", false);
        } else {
            wishlistRepository.save(new Wishlist(userId, productId));
            resp.put("action", "added");
            resp.put("status", true);
        }

        return ResponseEntity.ok(resp);
    }
}
