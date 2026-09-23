package com.elora.expensetracker.dto;

import java.math.BigDecimal;

public class CategorySummary {

    private String category;
    private BigDecimal total;
    private long count;
    private double percentage;

    public CategorySummary() {
    }

    public CategorySummary(String category, BigDecimal total, long count, double percentage) {
        this.category = category;
        this.total = total;
        this.count = count;
        this.percentage = percentage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
