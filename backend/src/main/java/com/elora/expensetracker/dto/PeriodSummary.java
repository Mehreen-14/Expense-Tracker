package com.elora.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PeriodSummary {

    private String label;
    private String humanizedLabel;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal total;
    private long count;
    private boolean currentPeriod;
    private boolean periodEnded;

    public PeriodSummary() {
    }

    public PeriodSummary(String label, String humanizedLabel, LocalDate startDate, LocalDate endDate,
                         BigDecimal total, long count, boolean currentPeriod, boolean periodEnded) {
        this.label = label;
        this.humanizedLabel = humanizedLabel;
        this.startDate = startDate;
        this.endDate = endDate;
        this.total = total;
        this.count = count;
        this.currentPeriod = currentPeriod;
        this.periodEnded = periodEnded;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getHumanizedLabel() {
        return humanizedLabel;
    }

    public void setHumanizedLabel(String humanizedLabel) {
        this.humanizedLabel = humanizedLabel;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
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

    public boolean isCurrentPeriod() {
        return currentPeriod;
    }

    public void setCurrentPeriod(boolean currentPeriod) {
        this.currentPeriod = currentPeriod;
    }

    public boolean isPeriodEnded() {
        return periodEnded;
    }

    public void setPeriodEnded(boolean periodEnded) {
        this.periodEnded = periodEnded;
    }
}
