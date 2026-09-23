package com.elora.expensetracker.repository;

import com.elora.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByExpenseDateDescCreatedAtDesc();

    List<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate BETWEEN :start AND :end")
    BigDecimal sumAmountBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.expenseDate BETWEEN :start AND :end")
    long countBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("""
            SELECT e.category, COALESCE(SUM(e.amount), 0), COUNT(e)
            FROM Expense e
            WHERE e.expenseDate BETWEEN :start AND :end
            GROUP BY e.category
            ORDER BY SUM(e.amount) DESC
            """)
    List<Object[]> sumByCategoryBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("""
            SELECT e FROM Expense e
            WHERE e.expenseDate BETWEEN :start AND :end
            ORDER BY e.amount DESC
            """)
    List<Expense> findTopExpensesBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    Expense findByTransactionId(String transactionId);
}
