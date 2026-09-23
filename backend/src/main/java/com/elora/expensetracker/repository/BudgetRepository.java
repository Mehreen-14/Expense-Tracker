package com.elora.expensetracker.repository;

import com.elora.expensetracker.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findFirstByOrderByIdAsc();
}
