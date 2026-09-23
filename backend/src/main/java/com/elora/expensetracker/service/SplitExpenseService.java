package com.elora.expensetracker.service;

import com.elora.expensetracker.dto.SplitExpenseRequest;
import com.elora.expensetracker.dto.SplitParticipantRequest;
import com.elora.expensetracker.model.SplitExpense;
import com.elora.expensetracker.model.SplitParticipant;
import com.elora.expensetracker.repository.SplitExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SplitExpenseService {

    private final SplitExpenseRepository splitExpenseRepository;

    public SplitExpenseService(SplitExpenseRepository splitExpenseRepository) {
        this.splitExpenseRepository = splitExpenseRepository;
    }

    public List<SplitExpense> findAll() {
        return splitExpenseRepository.findAllByOrderBySplitDateDescCreatedAtDesc();
    }

    public List<SplitExpense> findUnsettled() {
        return splitExpenseRepository.findBySettledFalseOrderBySplitDateDesc();
    }

    public SplitExpense findById(Long id) {
        return splitExpenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Split expense not found: " + id));
    }

    @Transactional
    public SplitExpense create(SplitExpenseRequest request) {
        SplitExpense split = new SplitExpense();
        split.setDescription(request.getDescription().trim());
        split.setAmount(request.getAmount());
        split.setPaidBy(request.getPaidBy().trim());
        split.setSplitDate(request.getSplitDate());

        List<SplitParticipant> participants = new ArrayList<>();
        if (request.getParticipants() != null) {
            for (SplitParticipantRequest pr : request.getParticipants()) {
                SplitParticipant p = new SplitParticipant();
                p.setName(pr.getName().trim());
                p.setAmountOwed(pr.getAmountOwed());
                p.setSplitExpense(split);
                participants.add(p);
            }
        }
        split.setParticipants(participants);
        return splitExpenseRepository.save(split);
    }

    @Transactional
    public SplitExpense update(Long id, SplitExpenseRequest request) {
        SplitExpense split = findById(id);
        split.setDescription(request.getDescription().trim());
        split.setAmount(request.getAmount());
        split.setPaidBy(request.getPaidBy().trim());
        split.setSplitDate(request.getSplitDate());

        split.getParticipants().clear();
        if (request.getParticipants() != null) {
            for (SplitParticipantRequest pr : request.getParticipants()) {
                SplitParticipant p = new SplitParticipant();
                p.setName(pr.getName().trim());
                p.setAmountOwed(pr.getAmountOwed());
                p.setSplitExpense(split);
                split.getParticipants().add(p);
            }
        }
        return splitExpenseRepository.save(split);
    }

    @Transactional
    public void delete(Long id) {
        if (!splitExpenseRepository.existsById(id)) {
            throw new IllegalArgumentException("Split expense not found: " + id);
        }
        splitExpenseRepository.deleteById(id);
    }

    @Transactional
    public SplitExpense settle(Long id) {
        SplitExpense split = findById(id);
        split.setSettled(true);
        for (SplitParticipant p : split.getParticipants()) {
            p.setPaid(true);
        }
        return splitExpenseRepository.save(split);
    }
}
