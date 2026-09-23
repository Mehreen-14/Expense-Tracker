package com.elora.expensetracker.repository;

import com.elora.expensetracker.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findAllByOrderByDueDayAsc();
}
