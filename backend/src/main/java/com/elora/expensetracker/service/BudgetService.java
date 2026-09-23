package com.elora.expensetracker.service;

import com.elora.expensetracker.dto.BudgetRequest;
import com.elora.expensetracker.model.Budget;
import com.elora.expensetracker.repository.BudgetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget getBudget() {
        return budgetRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultBudget);
    }

    @Transactional
    public Budget updateBudget(BudgetRequest request) {
        Budget budget = getBudget();
        budget.setMonthlyLimit(request.getMonthlyLimit());
        return budgetRepository.save(budget);
    }

    private Budget createDefaultBudget() {
        Budget budget = new Budget();
        budget.setMonthlyLimit(BigDecimal.ZERO);
        return budgetRepository.save(budget);
    }
}
