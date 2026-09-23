package com.elora.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class ForwardSummary {

    private String formattedText;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private BigDecimal total;
    private long totalCount;
    private Map<String, CategoryLine> byCategory;

    // inner class
    public static class CategoryLine {
        private String category;
        private BigDecimal total;
        private long count;

        public CategoryLine(String category, BigDecimal total, long count) {
            this.category = category;
            this.total = total;
            this.count = count;
        }

        public String getCategory() { return category; }
        public BigDecimal getTotal() { return total; }
        public long getCount() { return count; }
    }

    // getters/setters
    public String getFormattedText() { return formattedText; }
    public void setFormattedText(String formattedText) { this.formattedText = formattedText; }
    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }
    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public long getTotalCount() { return totalCount; }
    public void setTotalCount(long totalCount) { this.totalCount = totalCount; }
    public Map<String, CategoryLine> getByCategory() { return byCategory; }
    public void setByCategory(Map<String, CategoryLine> byCategory) { this.byCategory = byCategory; }
}
