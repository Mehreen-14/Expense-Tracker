package com.elora.expensetracker.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class SplitExpenseRequest {

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotBlank
    private String paidBy;

    @NotNull
    private LocalDate splitDate;

    @Valid
    private List<SplitParticipantRequest> participants;

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaidBy() { return paidBy; }
    public void setPaidBy(String paidBy) { this.paidBy = paidBy; }

    public LocalDate getSplitDate() { return splitDate; }
    public void setSplitDate(LocalDate splitDate) { this.splitDate = splitDate; }

    public List<SplitParticipantRequest> getParticipants() { return participants; }
    public void setParticipants(List<SplitParticipantRequest> participants) { this.participants = participants; }
}
