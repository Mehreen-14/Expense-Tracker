package com.elora.expensetracker.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class InsightsSummary {

    private BigDecimal monthlyBudget = BigDecimal.ZERO;
    private BigDecimal budgetUsed = BigDecimal.ZERO;
    private BigDecimal budgetRemaining = BigDecimal.ZERO;
    private double budgetUsedPercent;
    private boolean budgetExceeded;
    private BigDecimal averageDailyThisMonth = BigDecimal.ZERO;
    private BigDecimal monthOverMonthChange = BigDecimal.ZERO;
    private String topCategory;
    private BigDecimal topCategoryAmount = BigDecimal.ZERO;
    private BigDecimal largestExpenseThisMonth = BigDecimal.ZERO;
    private String largestExpenseDescription;
    private List<CategorySummary> categoryBreakdown = new ArrayList<>();
    private List<String> tips = new ArrayList<>();

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public BigDecimal getBudgetUsed() {
        return budgetUsed;
    }

    public void setBudgetUsed(BigDecimal budgetUsed) {
        this.budgetUsed = budgetUsed;
    }

    public BigDecimal getBudgetRemaining() {
        return budgetRemaining;
    }

    public void setBudgetRemaining(BigDecimal budgetRemaining) {
        this.budgetRemaining = budgetRemaining;
    }

    public double getBudgetUsedPercent() {
        return budgetUsedPercent;
    }

    public void setBudgetUsedPercent(double budgetUsedPercent) {
        this.budgetUsedPercent = budgetUsedPercent;
    }

    public boolean isBudgetExceeded() {
        return budgetExceeded;
    }

    public void setBudgetExceeded(boolean budgetExceeded) {
        this.budgetExceeded = budgetExceeded;
    }

    public BigDecimal getAverageDailyThisMonth() {
        return averageDailyThisMonth;
    }

    public void setAverageDailyThisMonth(BigDecimal averageDailyThisMonth) {
        this.averageDailyThisMonth = averageDailyThisMonth;
    }

    public BigDecimal getMonthOverMonthChange() {
        return monthOverMonthChange;
    }

    public void setMonthOverMonthChange(BigDecimal monthOverMonthChange) {
        this.monthOverMonthChange = monthOverMonthChange;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public BigDecimal getTopCategoryAmount() {
        return topCategoryAmount;
    }

    public void setTopCategoryAmount(BigDecimal topCategoryAmount) {
        this.topCategoryAmount = topCategoryAmount;
    }

    public BigDecimal getLargestExpenseThisMonth() {
        return largestExpenseThisMonth;
    }

    public void setLargestExpenseThisMonth(BigDecimal largestExpenseThisMonth) {
        this.largestExpenseThisMonth = largestExpenseThisMonth;
    }

    public String getLargestExpenseDescription() {
        return largestExpenseDescription;
    }

    public void setLargestExpenseDescription(String largestExpenseDescription) {
        this.largestExpenseDescription = largestExpenseDescription;
    }

    public List<CategorySummary> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategorySummary> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<String> getTips() {
        return tips;
    }

    public void setTips(List<String> tips) {
        this.tips = tips;
    }
}
