package com.elora.expensetracker.controller;

import com.elora.expensetracker.dto.ExpenseRequest;
import com.elora.expensetracker.model.Expense;
import com.elora.expensetracker.service.ExpenseService;
import com.elora.expensetracker.service.SslCommerzService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    private final SslCommerzService sslCommerzService;
    private final ExpenseService expenseService;

    public PaymentController(SslCommerzService sslCommerzService, ExpenseService expenseService) {
        this.sslCommerzService = sslCommerzService;
        this.expenseService = expenseService;
    }

    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@RequestBody Map<String, Object> request) {
        String phone = (String) request.get("phone");
        String method = (String) request.get("paymentMethod");
        String notes = (String) request.getOrDefault("notes", "");
        double amount = ((Number) request.get("amount")).doubleValue();

        String tranId = "TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        ExpenseRequest expenseRequest = new ExpenseRequest();
        expenseRequest.setDescription("Send Money - " + phone + " (" + method + ")");
        expenseRequest.setAmount(new java.math.BigDecimal(amount));
        expenseRequest.setCategory("Other");
        expenseRequest.setExpenseDate(java.time.LocalDate.now());
        expenseRequest.setFavorite(false);
        expenseRequest.setRecurring(false);
        expenseRequest.setPaymentMethod(method);
        expenseRequest.setNotes(notes);

        Expense expense = expenseService.create(expenseRequest);
        expense.setPaymentStatus("PENDING");
        expense.setTransactionId(tranId);
        expenseService.updatePaymentFields(expense);

        Map<String, Object> sslResponse = sslCommerzService.initiatePayment(tranId, amount, phone, method);

        String status = (String) sslResponse.get("status");
        if ("SUCCESS".equalsIgnoreCase(status) || "VALID".equalsIgnoreCase(status)) {
            String redirectUrl = (String) sslResponse.get("redirectGatewayURL");
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "redirectUrl", redirectUrl,
                    "tranId", tranId,
                    "expenseId", expense.getId()
            ));
        } else {
            expense.setPaymentStatus("FAILED");
            expenseService.updatePaymentFields(expense);
            String failReason = (String) sslResponse.getOrDefault("failedreason", "Payment initiation failed");
            return ResponseEntity.ok(Map.of(
                    "status", "FAILED",
                    "message", failReason
            ));
        }
    }

    @PostMapping("/verify/{tranId}")
    public ResponseEntity<?> verifyPayment(@PathVariable String tranId) {
        Map<String, Object> validation = sslCommerzService.validatePayment(tranId);

        String status = (String) validation.get("status");
        Expense expense = expenseService.findByTransactionId(tranId);

        if (expense == null) {
            return ResponseEntity.ok(Map.of("status", "NOT_FOUND", "message", "Expense not found"));
        }

        if ("VALID".equalsIgnoreCase(status)) {
            expense.setPaymentStatus("COMPLETED");
            expenseService.updatePaymentFields(expense);
            return ResponseEntity.ok(Map.of(
                    "status", "COMPLETED",
                    "amount", expense.getAmount(),
                    "description", expense.getDescription()
            ));
        } else {
            expense.setPaymentStatus("FAILED");
            expenseService.updatePaymentFields(expense);
            return ResponseEntity.ok(Map.of(
                    "status", "FAILED",
                    "message", "Payment verification failed"
            ));
        }
    }
}
