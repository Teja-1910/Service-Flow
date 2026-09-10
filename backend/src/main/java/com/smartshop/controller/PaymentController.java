package com.smartshop.controller;

import com.smartshop.model.Payment;
import com.smartshop.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/process")
    public ResponseEntity<?> processDemoPayment(@RequestBody Map<String, Object> req) {
        Long orderId = Long.valueOf(req.get("orderId").toString());
        String method = req.get("paymentMethod").toString();
        BigDecimal amount = new BigDecimal(req.get("amount").toString());
        String txnId = "TXN_SIH_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = new Payment(orderId, method, amount, "Success", txnId);
        Payment saved = paymentRepository.save(payment);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("transactionId", saved.getTransactionId());
        resp.put("paymentStatus", saved.getPaymentStatus());
        resp.put("amount", saved.getAmount());

        return ResponseEntity.ok(resp);
    }
}
