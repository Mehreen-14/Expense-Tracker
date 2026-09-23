package com.elora.expensetracker.controller;

import com.elora.expensetracker.dto.SplitExpenseRequest;
import com.elora.expensetracker.model.SplitExpense;
import com.elora.expensetracker.service.SplitExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/splits")
@CrossOrigin(origins = "http://localhost:4200")
public class SplitExpenseController {

    private final SplitExpenseService splitExpenseService;

    public SplitExpenseController(SplitExpenseService splitExpenseService) {
        this.splitExpenseService = splitExpenseService;
    }

    @GetMapping
    public List<SplitExpense> getAll() {
        return splitExpenseService.findAll();
    }

    @GetMapping("/unsettled")
    public List<SplitExpense> getUnsettled() {
        return splitExpenseService.findUnsettled();
    }

    @GetMapping("/{id}")
    public SplitExpense getById(@PathVariable Long id) {
        return splitExpenseService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SplitExpense create(@Valid @RequestBody SplitExpenseRequest request) {
        return splitExpenseService.create(request);
    }

    @PutMapping("/{id}")
    public SplitExpense update(@PathVariable Long id, @Valid @RequestBody SplitExpenseRequest request) {
        return splitExpenseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        splitExpenseService.delete(id);
    }

    @PatchMapping("/{id}/settle")
    public SplitExpense settle(@PathVariable Long id) {
        return splitExpenseService.settle(id);
    }
}
