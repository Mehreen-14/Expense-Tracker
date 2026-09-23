package com.elora.expensetracker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SslCommerzService {

    private static final Logger log = LoggerFactory.getLogger(SslCommerzService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${sslcommerz.api_url}")
    private String apiUrl;

    @Value("${sslcommerz.validation_url}")
    private String validationUrl;

    @Value("${sslcommerz.store_id}")
    private String storeId;

    @Value("${sslcommerz.store_password}")
    private String storePassword;

    @Value("${sslcommerz.success_url}")
    private String successUrl;

    @Value("${sslcommerz.fail_url}")
    private String failUrl;

    @Value("${sslcommerz.cancel_url}")
    private String cancelUrl;

    public Map<String, Object> initiatePayment(String tranId, double amount, String phone, String method) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("store_id", storeId);
        body.add("store_passwd", storePassword);
        body.add("total_amount", String.format("%.2f", amount));
        body.add("currency", "BDT");
        body.add("tran_id", tranId);
        body.add("success_url", successUrl + "?tran_id=" + tranId);
        body.add("fail_url", failUrl + "?tran_id=" + tranId);
        body.add("cancel_url", cancelUrl + "?tran_id=" + tranId);
        body.add("emi_option", "0");
        body.add("cus_name", "Customer");
        body.add("cus_email", "customer@example.com");
        body.add("cus_phone", phone);
        body.add("cus_add1", "Dhaka");
        body.add("cus_city", "Dhaka");
        body.add("cus_country", "Bangladesh");
        body.add("shipping_method", "NO");
        body.add("product_name", "Send Money - " + phone);
        body.add("product_category", "Other");
        body.add("product_profile", "general");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);
            Map<String, Object> responseBody = response.getBody();
            log.info("SSLCommerz initiate response: {}", responseBody);
            return responseBody != null ? responseBody : Map.of("status", "FAILED", "failedreason", "Empty response");
        } catch (Exception e) {
            log.error("SSLCommerz initiate error", e);
            return Map.of("status", "FAILED", "failedreason", e.getMessage());
        }
    }

    public Map<String, Object> validatePayment(String tranId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("store_id", storeId);
        body.add("store_passwd", storePassword);
        body.add("tran_id", tranId);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(validationUrl, request, Map.class);
            Map<String, Object> responseBody = response.getBody();
            log.info("SSLCommerz validate response: {}", responseBody);
            return responseBody != null ? responseBody : Map.of("status", "VALIDATED_FAILED");
        } catch (Exception e) {
            log.error("SSLCommerz validate error", e);
            return Map.of("status", "VALIDATED_FAILED", "error", e.getMessage());
        }
    }
}
