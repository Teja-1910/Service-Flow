package com.smartshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartShopApplication.class, args);

        System.out.println("=================================================");
        System.out.println(" SmartShop Backend is running successfully!");
        System.out.println(" AICTE Smart India Hackathon 2026 Prototype");
        System.out.println(" REST API available at: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}