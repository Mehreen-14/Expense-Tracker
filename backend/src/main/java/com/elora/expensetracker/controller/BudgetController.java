package com.elora.expensetracker.controller;

import com.elora.expensetracker.dto.BudgetRequest;
import com.elora.expensetracker.model.Budget;
import com.elora.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:4200")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public Budget getBudget() {
        return budgetService.getBudget();
    }

    @PutMapping
    public Budget updateBudget(@Valid @RequestBody BudgetRequest request) {
        return budgetService.updateBudget(request);
    }
}
