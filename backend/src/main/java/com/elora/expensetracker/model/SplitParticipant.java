package com.elora.expensetracker.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

@Entity
@Table(name = "split_participants")
public class SplitParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amountOwed;

    @Column(nullable = false)
    private boolean paid = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "split_expense_id", nullable = false)
    @JsonBackReference
    private SplitExpense splitExpense;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getAmountOwed() { return amountOwed; }
    public void setAmountOwed(BigDecimal amountOwed) { this.amountOwed = amountOwed; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public SplitExpense getSplitExpense() { return splitExpense; }
    public void setSplitExpense(SplitExpense splitExpense) { this.splitExpense = splitExpense; }
}
