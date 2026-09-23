package com.elora.expensetracker.controller;

import com.elora.expensetracker.dto.ForwardRequest;
import com.elora.expensetracker.dto.ForwardSummary;
import com.elora.expensetracker.model.Expense;
import com.elora.expensetracker.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/forward")
@CrossOrigin(origins = "http://localhost:4200")
public class ForwardController {

    private final ExpenseRepository expenseRepository;

    public ForwardController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @PostMapping
    public ForwardSummary getForwardSummary(@Valid @RequestBody ForwardRequest request) {
        List<Expense> expenses = expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(
                request.getDateFrom(), request.getDateTo());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM d, yyyy");

        Map<String, ForwardSummary.CategoryLine> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        LinkedHashMap::new,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> new ForwardSummary.CategoryLine(
                                        list.get(0).getCategory(),
                                        list.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add),
                                        list.size())
                        )
                ));

        BigDecimal total = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        StringBuilder sb = new StringBuilder();
        sb.append("Expense Summary (")
          .append(request.getDateFrom().format(fmt))
          .append(" - ")
          .append(request.getDateTo().format(fmt))
          .append(")\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        for (ForwardSummary.CategoryLine line : byCategory.values()) {
            sb.append(String.format("%-12s ৳%,.0f (%d expense%s)\n",
                    line.getCategory(), line.getTotal(), line.getCount(),
                    line.getCount() == 1 ? "" : "s"));
        }

        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append(String.format("Total:      ৳%,.0f (%d expense%s)",
                total, expenses.size(), expenses.size() == 1 ? "" : "s"));

        ForwardSummary summary = new ForwardSummary();
        summary.setFormattedText(sb.toString());
        summary.setDateFrom(request.getDateFrom());
        summary.setDateTo(request.getDateTo());
        summary.setTotal(total);
        summary.setTotalCount(expenses.size());
        summary.setByCategory(byCategory);

        return summary;
    }
}
