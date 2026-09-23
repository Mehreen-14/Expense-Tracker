package com.elora.expensetracker.controller;

import com.elora.expensetracker.dto.BillRequest;
import com.elora.expensetracker.model.Bill;
import com.elora.expensetracker.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:4200")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    public List<Bill> getAll() {
        return billService.findAll();
    }

    @GetMapping("/{id}")
    public Bill getById(@PathVariable Long id) {
        return billService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Bill create(@Valid @RequestBody BillRequest request) {
        return billService.create(request);
    }

    @PutMapping("/{id}")
    public Bill update(@PathVariable Long id, @Valid @RequestBody BillRequest request) {
        return billService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        billService.delete(id);
    }

    @PatchMapping("/{id}/toggle-active")
    public Bill toggleActive(@PathVariable Long id) {
        return billService.toggleActive(id);
    }
}
