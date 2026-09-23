package com.elora.expensetracker.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "split_expenses")
public class SplitExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String description;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @NotBlank
    @Column(nullable = false)
    private String paidBy;

    @NotNull
    @Column(nullable = false)
    private LocalDate splitDate;

    @Column(nullable = false)
    private boolean settled = false;

    @OneToMany(mappedBy = "splitExpense", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SplitParticipant> participants = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaidBy() { return paidBy; }
    public void setPaidBy(String paidBy) { this.paidBy = paidBy; }

    public LocalDate getSplitDate() { return splitDate; }
    public void setSplitDate(LocalDate splitDate) { this.splitDate = splitDate; }

    public boolean isSettled() { return settled; }
    public void setSettled(boolean settled) { this.settled = settled; }

    public List<SplitParticipant> getParticipants() { return participants; }
    public void setParticipants(List<SplitParticipant> participants) { this.participants = participants; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
