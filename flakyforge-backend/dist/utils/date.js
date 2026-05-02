"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekStart = getWeekStart;
exports.getWeekRanges = getWeekRanges;
function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}
function getWeekRanges() {
    const thisWeekStart = getWeekStart();
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);
    return {
        thisWeekStart,
        thisWeekEnd,
        lastWeekStart,
        lastWeekEnd
    };
}
