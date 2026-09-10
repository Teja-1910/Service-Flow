package com.smartshop.controller;

import com.smartshop.model.Product;
import com.smartshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getRecommendations(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long productId) {
        
        // If specific category requested, recommend items in same or complementary category
        if (categoryId != null) {
            List<Product> categoryProducts = productRepository.findByCategoryId(categoryId);
            if (!categoryProducts.isEmpty()) {
                return categoryProducts;
            }
        }

        // If product requested, recommend top items in related category
        if (productId != null) {
            return productRepository.findById(productId).map(p -> {
                List<Product> related = productRepository.findByCategoryId(p.getCategoryId());
                return related.stream().filter(item -> !item.getId().equals(productId)).toList();
            }).orElse(productRepository.findTop8ByOrderByRatingDesc());
        }

        // Default: Top rated products
        List<Product> top = productRepository.findTop8ByOrderByRatingDesc();
        if (top.isEmpty()) {
            return productRepository.findAll();
        }
        return top;
    }
}
