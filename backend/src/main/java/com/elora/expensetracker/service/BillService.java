package com.elora.expensetracker.service;

import com.elora.expensetracker.dto.BillRequest;
import com.elora.expensetracker.model.Bill;
import com.elora.expensetracker.repository.BillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> findAll() {
        return billRepository.findAllByOrderByDueDayAsc();
    }

    public Bill findById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found: " + id));
    }

    @Transactional
    public Bill create(BillRequest request) {
        Bill bill = new Bill();
        applyRequest(bill, request);
        return billRepository.save(bill);
    }

    @Transactional
    public Bill update(Long id, BillRequest request) {
        Bill bill = findById(id);
        applyRequest(bill, request);
        return billRepository.save(bill);
    }

    @Transactional
    public void delete(Long id) {
        if (!billRepository.existsById(id)) {
            throw new IllegalArgumentException("Bill not found: " + id);
        }
        billRepository.deleteById(id);
    }

    @Transactional
    public Bill toggleActive(Long id) {
        Bill bill = findById(id);
        bill.setActive(!bill.isActive());
        return billRepository.save(bill);
    }

    private void applyRequest(Bill bill, BillRequest request) {
        bill.setName(request.getName().trim());
        bill.setAmount(request.getAmount());
        bill.setDueDay(request.getDueDay());
        bill.setCategory(request.getCategory() != null ? request.getCategory().trim() : "Other");
        bill.setReminderDaysBefore(request.getReminderDaysBefore() != null ? request.getReminderDaysBefore() : 3);
    }
}
