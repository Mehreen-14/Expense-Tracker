package com.elora.expensetracker.service;

import com.elora.expensetracker.dto.DashboardSummary;
import com.elora.expensetracker.dto.ExpenseRequest;
import com.elora.expensetracker.dto.PeriodSummary;
import com.elora.expensetracker.model.Expense;
import com.elora.expensetracker.repository.ExpenseRepository;
import com.elora.expensetracker.util.PeriodHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> findAll() {
        return expenseRepository.findAllByOrderByExpenseDateDescCreatedAtDesc();
    }

    public Expense findById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found: " + id));
    }

    @Transactional
    public Expense create(ExpenseRequest request) {
        Expense expense = new Expense();
        applyRequest(expense, request);
        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense update(Long id, ExpenseRequest request) {
        Expense expense = findById(id);
        applyRequest(expense, request);
        return expenseRepository.save(expense);
    }

    @Transactional
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new IllegalArgumentException("Expense not found: " + id);
        }
        expenseRepository.deleteById(id);
    }

    @Transactional
    public void bulkDelete(List<Long> ids) {
        expenseRepository.deleteAllById(ids);
    }

    @Transactional
    public Expense toggleFavorite(Long id) {
        Expense expense = findById(id);
        expense.setFavorite(!expense.isFavorite());
        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense toggleRecurring(Long id) {
        Expense expense = findById(id);
        expense.setRecurring(!expense.isRecurring());
        return expenseRepository.save(expense);
    }

    public Expense findByTransactionId(String transactionId) {
        return expenseRepository.findByTransactionId(transactionId);
    }

    @Transactional
    public Expense updatePaymentFields(Expense expense) {
        return expenseRepository.save(expense);
    }

    public DashboardSummary getDashboardSummary() {
        LocalDate today = LocalDate.now();
        DashboardSummary summary = new DashboardSummary();

        summary.setToday(buildDaySummary(today, today, true));
        summary.setYesterday(buildDaySummary(today.minusDays(1), today, false));

        LocalDate thisWeekStart = PeriodHelper.startOfWeek(today);
        LocalDate thisWeekEnd = PeriodHelper.endOfWeek(today);
        summary.setThisWeek(buildWeekSummary(thisWeekStart, thisWeekEnd, today, true));

        LocalDate lastWeekStart = thisWeekStart.minusWeeks(1);
        LocalDate lastWeekEnd = thisWeekEnd.minusWeeks(1);
        summary.setLastWeek(buildWeekSummary(lastWeekStart, lastWeekEnd, today, false));

        LocalDate thisMonthStart = PeriodHelper.startOfMonth(today);
        LocalDate thisMonthEnd = PeriodHelper.endOfMonth(today);
        summary.setThisMonth(buildMonthSummary(thisMonthStart, thisMonthEnd, today, true));

        LocalDate lastMonthDate = today.minusMonths(1);
        LocalDate lastMonthStart = PeriodHelper.startOfMonth(lastMonthDate);
        LocalDate lastMonthEnd = PeriodHelper.endOfMonth(lastMonthDate);
        summary.setLastMonth(buildMonthSummary(lastMonthStart, lastMonthEnd, today, false));

        LocalDate thisYearStart = PeriodHelper.startOfYear(today);
        LocalDate thisYearEnd = PeriodHelper.endOfYear(today);
        summary.setThisYear(buildYearSummary(thisYearStart, thisYearEnd, today.getYear(), today, true));

        int lastYear = today.getYear() - 1;
        LocalDate lastYearStart = LocalDate.of(lastYear, 1, 1);
        LocalDate lastYearEnd = LocalDate.of(lastYear, 12, 31);
        summary.setLastYear(buildYearSummary(lastYearStart, lastYearEnd, lastYear, today, false));

        List<PeriodSummary> recentDays = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = today.minusDays(i);
            recentDays.add(buildDaySummary(day, today, day.equals(today)));
        }
        summary.setRecentDays(recentDays);

        return summary;
    }

    private PeriodSummary buildDaySummary(LocalDate day, LocalDate today, boolean current) {
        BigDecimal total = expenseRepository.sumAmountBetween(day, day);
        long count = expenseRepository.countBetween(day, day);
        boolean periodEnded = day.isBefore(today);

        String humanized = PeriodHelper.humanizeDay(day, today);
        if (periodEnded && !current) {
            humanized += " · " + PeriodHelper.endedMessage(true, "day");
        } else if (current) {
            humanized += " · " + PeriodHelper.endedMessage(false, "day");
        }

        return new PeriodSummary(
                day.toString(),
                humanized,
                day,
                day,
                total,
                count,
                current,
                periodEnded
        );
    }

    private PeriodSummary buildWeekSummary(LocalDate start, LocalDate end, LocalDate today, boolean current) {
        BigDecimal total = expenseRepository.sumAmountBetween(start, end);
        long count = expenseRepository.countBetween(start, end);
        boolean periodEnded = end.isBefore(today);

        String humanized = PeriodHelper.humanizeWeek(start, end, today, current);
        humanized += " · " + PeriodHelper.endedMessage(periodEnded, "week");

        return new PeriodSummary(
                start + "_week",
                humanized,
                start,
                end,
                total,
                count,
                current,
                periodEnded
        );
    }

    private PeriodSummary buildMonthSummary(LocalDate start, LocalDate end, LocalDate today, boolean current) {
        BigDecimal total = expenseRepository.sumAmountBetween(start, end);
        long count = expenseRepository.countBetween(start, end);
        boolean periodEnded = end.isBefore(today);

        String humanized = PeriodHelper.humanizeMonth(start, today, current);
        humanized += " · " + PeriodHelper.endedMessage(periodEnded, "month");

        return new PeriodSummary(
                start.getYear() + "-" + String.format("%02d", start.getMonthValue()),
                humanized,
                start,
                end,
                total,
                count,
                current,
                periodEnded
        );
    }

    private PeriodSummary buildYearSummary(LocalDate start, LocalDate end, int year, LocalDate today, boolean current) {
        BigDecimal total = expenseRepository.sumAmountBetween(start, end);
        long count = expenseRepository.countBetween(start, end);
        boolean periodEnded = end.isBefore(today);

        String humanized = PeriodHelper.humanizeYear(year, today, current);
        humanized += " · " + PeriodHelper.endedMessage(periodEnded, "year");

        return new PeriodSummary(
                String.valueOf(year),
                humanized,
                start,
                end,
                total,
                count,
                current,
                periodEnded
        );
    }

    private void applyRequest(Expense expense, ExpenseRequest request) {
        expense.setDescription(request.getDescription().trim());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory().trim());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setFavorite(request.isFavorite());
        expense.setRecurring(request.isRecurring());
        expense.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cash");
        expense.setNotes(request.getNotes() != null ? request.getNotes() : "");
    }
}
