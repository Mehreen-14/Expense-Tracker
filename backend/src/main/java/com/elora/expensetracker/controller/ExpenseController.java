package com.elora.expensetracker.controller;

import com.elora.expensetracker.dto.DashboardSummary;
import com.elora.expensetracker.dto.ExpenseRequest;
import com.elora.expensetracker.model.Expense;
import com.elora.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> getAll() {
        return expenseService.findAll();
    }

    @GetMapping("/{id}")
    public Expense getById(@PathVariable Long id) {
        return expenseService.findById(id);
    }

    @GetMapping("/summary")
    public DashboardSummary getSummary() {
        return expenseService.getDashboardSummary();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Expense create(@Valid @RequestBody ExpenseRequest request) {
        return expenseService.create(request);
    }

    @PutMapping("/{id}")
    public Expense update(@PathVariable Long id, @Valid @RequestBody ExpenseRequest request) {
        return expenseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        expenseService.delete(id);
    }

    @PostMapping("/bulk-delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void bulkDelete(@RequestBody List<Long> ids) {
        expenseService.bulkDelete(ids);
    }

    @PatchMapping("/{id}/toggle-favorite")
    public Expense toggleFavorite(@PathVariable Long id) {
        return expenseService.toggleFavorite(id);
    }

    @PatchMapping("/{id}/toggle-recurring")
    public Expense toggleRecurring(@PathVariable Long id) {
        return expenseService.toggleRecurring(id);
    }
}
