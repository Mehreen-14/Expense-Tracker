package com.elora.expensetracker.repository;

import com.elora.expensetracker.model.SplitExpense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SplitExpenseRepository extends JpaRepository<SplitExpense, Long> {

    List<SplitExpense> findAllByOrderBySplitDateDescCreatedAtDesc();

    List<SplitExpense> findBySettledFalseOrderBySplitDateDesc();
}
