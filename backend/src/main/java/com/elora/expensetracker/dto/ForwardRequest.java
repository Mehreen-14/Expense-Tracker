package com.elora.expensetracker.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ForwardRequest {

    @NotNull
    private LocalDate dateFrom;

    @NotNull
    private LocalDate dateTo;

    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }

    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }
}
