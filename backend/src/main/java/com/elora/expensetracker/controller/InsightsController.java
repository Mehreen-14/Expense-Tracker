package com.elora.expensetracker.controller;

import com.elora.expensetracker.dto.InsightsSummary;
import com.elora.expensetracker.service.InsightsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
@CrossOrigin(origins = "http://localhost:4200")
public class InsightsController {

    private final InsightsService insightsService;

    public InsightsController(InsightsService insightsService) {
        this.insightsService = insightsService;
    }

    @GetMapping
    public InsightsSummary getInsights() {
        return insightsService.getInsights();
    }
}
