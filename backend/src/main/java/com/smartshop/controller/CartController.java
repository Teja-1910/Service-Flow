package com.smartshop.controller;

import com.smartshop.model.Cart;
import com.smartshop.model.CartItem;
import com.smartshop.repository.CartItemRepository;
import com.smartshop.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping
    public List<CartItem> getCartItems(@RequestParam Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(new Cart(userId)));
        return cartItemRepository.findByCartId(cart.getId());
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Object> req) {
        Long userId = Long.valueOf(req.get("userId").toString());
        Long productId = Long.valueOf(req.get("productId").toString());
        Integer quantity = req.containsKey("quantity") ? Integer.valueOf(req.get("quantity").toString()) : 1;

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(new Cart(userId)));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + quantity);
                    return existing;
                })
                .orElseGet(() -> new CartItem(cart.getId(), productId, quantity));

        return ResponseEntity.ok(cartItemRepository.save(item));
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long id) {
        cartItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
