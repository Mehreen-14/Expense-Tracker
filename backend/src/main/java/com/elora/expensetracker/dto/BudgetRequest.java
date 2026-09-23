package com.elora.expensetracker.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class BudgetRequest {

    @NotNull
    @PositiveOrZero
    private BigDecimal monthlyLimit;

    public BigDecimal getMonthlyLimit() {
        return monthlyLimit;
    }

    public void setMonthlyLimit(BigDecimal monthlyLimit) {
        this.monthlyLimit = monthlyLimit;
    }
}
