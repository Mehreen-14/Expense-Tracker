package com.elora.expensetracker.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;

public final class PeriodHelper {

    private static final DateTimeFormatter DAY_FORMAT = DateTimeFormatter.ofPattern("EEEE, MMM d");
    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("MMMM yyyy");
    private static final DateTimeFormatter WEEK_RANGE_FORMAT = DateTimeFormatter.ofPattern("MMM d");

    private PeriodHelper() {
    }

    public static LocalDate startOfWeek(LocalDate date) {
        return date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    public static LocalDate endOfWeek(LocalDate date) {
        return date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
    }

    public static LocalDate startOfMonth(LocalDate date) {
        return date.withDayOfMonth(1);
    }

    public static LocalDate endOfMonth(LocalDate date) {
        return date.with(TemporalAdjusters.lastDayOfMonth());
    }

    public static LocalDate startOfYear(LocalDate date) {
        return date.withDayOfYear(1);
    }

    public static LocalDate endOfYear(LocalDate date) {
        return date.with(TemporalAdjusters.lastDayOfYear());
    }

    public static String humanizeDay(LocalDate date, LocalDate today) {
        if (date.equals(today)) {
            return "Today";
        }
        if (date.equals(today.minusDays(1))) {
            return "Yesterday";
        }
        if (date.isAfter(today.minusDays(7))) {
            return date.format(DAY_FORMAT);
        }
        return date.format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
    }

    public static String humanizeWeek(LocalDate start, LocalDate end, LocalDate today, boolean current) {
        if (current) {
            return "This week (" + start.format(WEEK_RANGE_FORMAT) + " – " + end.format(WEEK_RANGE_FORMAT) + ")";
        }
        LocalDate thisWeekStart = startOfWeek(today);
        if (start.equals(thisWeekStart.minusWeeks(1))) {
            return "Last week (" + start.format(WEEK_RANGE_FORMAT) + " – " + end.format(WEEK_RANGE_FORMAT) + ")";
        }
        return "Week of " + start.format(WEEK_RANGE_FORMAT) + " – " + end.format(WEEK_RANGE_FORMAT);
    }

    public static String humanizeMonth(LocalDate monthDate, LocalDate today, boolean current) {
        if (current) {
            return "This month (" + monthDate.format(MONTH_FORMAT) + ")";
        }
        if (monthDate.getMonth() == today.minusMonths(1).getMonth()
                && monthDate.getYear() == today.minusMonths(1).getYear()) {
            return "Last month (" + monthDate.format(MONTH_FORMAT) + ")";
        }
        return monthDate.format(MONTH_FORMAT);
    }

    public static String humanizeYear(int year, LocalDate today, boolean current) {
        if (current) {
            return "This year (" + year + ")";
        }
        if (year == today.getYear() - 1) {
            return "Last year (" + year + ")";
        }
        return String.valueOf(year);
    }

    public static String endedMessage(boolean periodEnded, String periodType) {
        if (!periodEnded) {
            return "Still in progress";
        }
        return switch (periodType) {
            case "day" -> "Day ended";
            case "week" -> "Week ended";
            case "month" -> "Month ended";
            case "year" -> "Year ended";
            default -> "Period ended";
        };
    }
}
