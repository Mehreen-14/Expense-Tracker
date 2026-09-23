package com.elora.expensetracker.service;

import com.elora.expensetracker.dto.CategorySummary;
import com.elora.expensetracker.dto.InsightsSummary;
import com.elora.expensetracker.model.Budget;
import com.elora.expensetracker.model.Expense;
import com.elora.expensetracker.repository.ExpenseRepository;
import com.elora.expensetracker.util.PeriodHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class InsightsService {

    private final ExpenseRepository expenseRepository;
    private final BudgetService budgetService;

    public InsightsService(ExpenseRepository expenseRepository, BudgetService budgetService) {
        this.expenseRepository = expenseRepository;
        this.budgetService = budgetService;
    }

    public InsightsSummary getInsights() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = PeriodHelper.startOfMonth(today);
        LocalDate monthEnd = PeriodHelper.endOfMonth(today);

        LocalDate lastMonthDate = today.minusMonths(1);
        LocalDate lastMonthStart = PeriodHelper.startOfMonth(lastMonthDate);
        LocalDate lastMonthEnd = PeriodHelper.endOfMonth(lastMonthDate);

        BigDecimal thisMonthTotal = expenseRepository.sumAmountBetween(monthStart, monthEnd);
        BigDecimal lastMonthTotal = expenseRepository.sumAmountBetween(lastMonthStart, lastMonthEnd);

        Budget budget = budgetService.getBudget();
        BigDecimal monthlyLimit = budget.getMonthlyLimit();

        InsightsSummary insights = new InsightsSummary();
        insights.setMonthlyBudget(monthlyLimit);
        insights.setBudgetUsed(thisMonthTotal);

        if (monthlyLimit.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal remaining = monthlyLimit.subtract(thisMonthTotal);
            insights.setBudgetRemaining(remaining.max(BigDecimal.ZERO));
            insights.setBudgetExceeded(thisMonthTotal.compareTo(monthlyLimit) > 0);
            insights.setBudgetUsedPercent(
                    thisMonthTotal.multiply(BigDecimal.valueOf(100))
                            .divide(monthlyLimit, 1, RoundingMode.HALF_UP)
                            .doubleValue()
            );
        } else {
            insights.setBudgetRemaining(BigDecimal.ZERO);
            insights.setBudgetUsedPercent(0);
        }

        int daysElapsed = today.getDayOfMonth();
        if (daysElapsed > 0) {
            insights.setAverageDailyThisMonth(
                    thisMonthTotal.divide(BigDecimal.valueOf(daysElapsed), 2, RoundingMode.HALF_UP)
            );
        }

        if (lastMonthTotal.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal change = thisMonthTotal.subtract(lastMonthTotal)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(lastMonthTotal, 1, RoundingMode.HALF_UP);
            insights.setMonthOverMonthChange(change);
        }

        List<CategorySummary> breakdown = buildCategoryBreakdown(monthStart, monthEnd, thisMonthTotal);
        insights.setCategoryBreakdown(breakdown);

        if (!breakdown.isEmpty()) {
            CategorySummary top = breakdown.get(0);
            insights.setTopCategory(top.getCategory());
            insights.setTopCategoryAmount(top.getTotal());
        }

        List<Expense> topExpenses = expenseRepository.findTopExpensesBetween(monthStart, monthEnd);
        if (!topExpenses.isEmpty()) {
            Expense largest = topExpenses.get(0);
            insights.setLargestExpenseThisMonth(largest.getAmount());
            insights.setLargestExpenseDescription(largest.getDescription());
        }

        insights.setTips(buildTips(insights, thisMonthTotal, lastMonthTotal, today));

        return insights;
    }

    private List<CategorySummary> buildCategoryBreakdown(LocalDate start, LocalDate end, BigDecimal total) {
        List<Object[]> rows = expenseRepository.sumByCategoryBetween(start, end);
        List<CategorySummary> breakdown = new ArrayList<>();

        for (Object[] row : rows) {
            String category = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            long count = (Long) row[2];
            double percentage = total.compareTo(BigDecimal.ZERO) > 0
                    ? amount.multiply(BigDecimal.valueOf(100))
                            .divide(total, 1, RoundingMode.HALF_UP)
                            .doubleValue()
                    : 0;
            breakdown.add(new CategorySummary(category, amount, count, percentage));
        }

        return breakdown;
    }

    private List<String> buildTips(InsightsSummary insights, BigDecimal thisMonth,
                                   BigDecimal lastMonth, LocalDate today) {
        List<String> tips = new ArrayList<>();

        if (insights.getMonthlyBudget().compareTo(BigDecimal.ZERO) > 0) {
            if (insights.isBudgetExceeded()) {
                tips.add("You have exceeded your monthly budget. Review non-essential spending.");
            } else if (insights.getBudgetUsedPercent() >= 80) {
                tips.add("You have used over 80% of your monthly budget — spend carefully for the rest of the month.");
            } else if (insights.getBudgetUsedPercent() <= 50 && today.getDayOfMonth() > 15) {
                tips.add("Great job! You are under half your budget with the month halfway done.");
            }
        } else {
            tips.add("Set a monthly budget to get spending alerts and track progress.");
        }

        if (lastMonth.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal change = insights.getMonthOverMonthChange();
            if (change.compareTo(BigDecimal.valueOf(15)) > 0) {
                tips.add("Spending is up " + change + "% compared to last month.");
            } else if (change.compareTo(BigDecimal.valueOf(-10)) < 0) {
                tips.add("Nice! You are spending " + change.abs() + "% less than last month.");
            }
        }

        if (insights.getTopCategory() != null) {
            tips.add("Your top category this month is " + insights.getTopCategory() + ".");
        }

        if (tips.isEmpty()) {
            tips.add("Keep logging expenses daily for better insights.");
        }

        return tips;
    }
}
