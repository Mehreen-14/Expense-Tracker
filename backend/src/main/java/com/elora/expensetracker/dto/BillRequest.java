package com.elora.expensetracker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class BillRequest {

    @NotBlank
    private String name;

    @NotNull
    @PositiveOrZero
    private BigDecimal amount;

    @NotNull
    @Min(1)
    @Max(31)
    private Integer dueDay;

    private String category = "Other";

    private Integer reminderDaysBefore = 3;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Integer getDueDay() { return dueDay; }
    public void setDueDay(Integer dueDay) { this.dueDay = dueDay; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getReminderDaysBefore() { return reminderDaysBefore; }
    public void setReminderDaysBefore(Integer reminderDaysBefore) { this.reminderDaysBefore = reminderDaysBefore; }
}
