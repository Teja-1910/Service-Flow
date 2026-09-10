package com.smartshop.repository;

import com.smartshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findTop8ByOrderByRatingDesc();
    List<Product> findTop4ByCategoryId(Long categoryId);
}
