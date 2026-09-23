package com.elora.expensetracker.dto;

import java.util.List;

public class DashboardSummary {

    private PeriodSummary today;
    private PeriodSummary yesterday;
    private PeriodSummary thisWeek;
    private PeriodSummary lastWeek;
    private PeriodSummary thisMonth;
    private PeriodSummary lastMonth;
    private PeriodSummary thisYear;
    private PeriodSummary lastYear;
    private List<PeriodSummary> recentDays;

    public PeriodSummary getToday() {
        return today;
    }

    public void setToday(PeriodSummary today) {
        this.today = today;
    }

    public PeriodSummary getYesterday() {
        return yesterday;
    }

    public void setYesterday(PeriodSummary yesterday) {
        this.yesterday = yesterday;
    }

    public PeriodSummary getThisWeek() {
        return thisWeek;
    }

    public void setThisWeek(PeriodSummary thisWeek) {
        this.thisWeek = thisWeek;
    }

    public PeriodSummary getLastWeek() {
        return lastWeek;
    }

    public void setLastWeek(PeriodSummary lastWeek) {
        this.lastWeek = lastWeek;
    }

    public PeriodSummary getThisMonth() {
        return thisMonth;
    }

    public void setThisMonth(PeriodSummary thisMonth) {
        this.thisMonth = thisMonth;
    }

    public PeriodSummary getLastMonth() {
        return lastMonth;
    }

    public void setLastMonth(PeriodSummary lastMonth) {
        this.lastMonth = lastMonth;
    }

    public PeriodSummary getThisYear() {
        return thisYear;
    }

    public void setThisYear(PeriodSummary thisYear) {
        this.thisYear = thisYear;
    }

    public PeriodSummary getLastYear() {
        return lastYear;
    }

    public void setLastYear(PeriodSummary lastYear) {
        this.lastYear = lastYear;
    }

    public List<PeriodSummary> getRecentDays() {
        return recentDays;
    }

    public void setRecentDays(List<PeriodSummary> recentDays) {
        this.recentDays = recentDays;
    }
}
