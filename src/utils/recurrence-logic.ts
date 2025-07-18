import { 
  RecurrenceRule, 
  GeneratedDate, 
  DayOfWeek, 
  MonthlyPattern, 
  WeekOfMonth 
} from '@/types/recurrence';

const DAY_OF_WEEK_MAP: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export class RecurrenceGenerator {
  static generate(rule: RecurrenceRule, maxDates: number = 100): GeneratedDate[] {
    const dates: GeneratedDate[] = [];
    const { startDate, endDate } = rule;
    
    // Add start date
    dates.push({ date: new Date(startDate), type: 'start' });
    
    let currentDate = new Date(startDate);
    let count = 0;
    
    while (count < maxDates) {
      const nextDate = this.getNextDate(currentDate, rule);
      
      if (!nextDate) break;
      
      // Check if we've exceeded the end date
      if (endDate && nextDate > endDate) break;
      
      dates.push({ date: nextDate, type: 'recurring' });
      currentDate = nextDate;
      count++;
    }
    
    // Add end date if specified
    if (endDate) {
      dates.push({ date: new Date(endDate), type: 'end' });
    }
    
    return dates.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  private static getNextDate(currentDate: Date, rule: RecurrenceRule): Date | null {
    const { type, interval } = rule;
    
    switch (type) {
      case 'daily':
        return this.getNextDailyDate(currentDate, interval);
      case 'weekly':
        return this.getNextWeeklyDate(currentDate, rule);
      case 'monthly':
        return this.getNextMonthlyDate(currentDate, rule);
      case 'yearly':
        return this.getNextYearlyDate(currentDate, rule);
      default:
        return null;
    }
  }
  
  private static getNextDailyDate(currentDate: Date, interval: number): Date {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
  }
  
  private static getNextWeeklyDate(currentDate: Date, rule: RecurrenceRule): Date | null {
    const { interval, daysOfWeek } = rule;
    
    if (!daysOfWeek || daysOfWeek.length === 0) {
      // Default to same day of week
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + (7 * interval));
      return nextDate;
    }
    
    // Find next occurrence of any specified day of week
    const currentDayOfWeek = currentDate.getDay();
    const targetDays = daysOfWeek.map(day => DAY_OF_WEEK_MAP[day]).sort();
    
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1); // Start from next day
    
    let weeksPassed = 0;
    
    while (weeksPassed < interval || !targetDays.includes(nextDate.getDay())) {
      if (nextDate.getDay() === 0 && weeksPassed > 0) { // Sunday = start of new week
        weeksPassed++;
      }
      
      if (weeksPassed >= interval && targetDays.includes(nextDate.getDay())) {
        return nextDate;
      }
      
      nextDate.setDate(nextDate.getDate() + 1);
      
      // Prevent infinite loop
      if (nextDate.getTime() - currentDate.getTime() > 365 * 24 * 60 * 60 * 1000) {
        break;
      }
    }
    
    return nextDate;
  }
  
  private static getNextMonthlyDate(currentDate: Date, rule: RecurrenceRule): Date | null {
    const { interval, monthlyPattern, dayOfMonth, weekOfMonth, dayOfWeekInMonth } = rule;
    
    if (monthlyPattern === 'date' && dayOfMonth) {
      return this.getNextMonthlyByDate(currentDate, interval, dayOfMonth);
    }
    
    if (monthlyPattern === 'day-of-week' && weekOfMonth && dayOfWeekInMonth) {
      return this.getNextMonthlyByDayOfWeek(currentDate, interval, weekOfMonth, dayOfWeekInMonth);
    }
    
    // Default to same date next month
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + interval);
    return nextDate;
  }
  
  private static getNextMonthlyByDate(currentDate: Date, interval: number, dayOfMonth: number): Date {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + interval);
    nextDate.setDate(Math.min(dayOfMonth, this.getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())));
    return nextDate;
  }
  
  private static getNextMonthlyByDayOfWeek(
    currentDate: Date, 
    interval: number, 
    weekOfMonth: WeekOfMonth, 
    dayOfWeekInMonth: DayOfWeek
  ): Date {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + interval);
    nextDate.setDate(1); // Start of month
    
    const targetDayOfWeek = DAY_OF_WEEK_MAP[dayOfWeekInMonth];
    
    if (weekOfMonth === 'last') {
      // Find last occurrence of target day in month
      const lastDayOfMonth = this.getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth());
      nextDate.setDate(lastDayOfMonth);
      
      while (nextDate.getDay() !== targetDayOfWeek) {
        nextDate.setDate(nextDate.getDate() - 1);
      }
    } else {
      // Find first occurrence of target day in month
      while (nextDate.getDay() !== targetDayOfWeek) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      
      // Add weeks based on weekOfMonth
      const weekMap = { first: 0, second: 1, third: 2, fourth: 3 };
      const weeksToAdd = weekMap[weekOfMonth as keyof typeof weekMap];
      nextDate.setDate(nextDate.getDate() + (weeksToAdd * 7));
      
      // Check if we've gone into next month
      if (nextDate.getMonth() !== (currentDate.getMonth() + interval) % 12) {
        // Go back to previous week
        nextDate.setDate(nextDate.getDate() - 7);
      }
    }
    
    return nextDate;
  }
  
  private static getNextYearlyDate(currentDate: Date, rule: RecurrenceRule): Date {
    const { interval, monthOfYear, dayOfMonth } = rule;
    const nextDate = new Date(currentDate);
    
    nextDate.setFullYear(nextDate.getFullYear() + interval);
    
    if (monthOfYear !== undefined) {
      nextDate.setMonth(monthOfYear - 1); // monthOfYear is 1-based
    }
    
    if (dayOfMonth !== undefined) {
      nextDate.setDate(Math.min(dayOfMonth, this.getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())));
    }
    
    return nextDate;
  }
  
  private static getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
  
  static validateRule(rule: RecurrenceRule): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check required fields
    if (!rule.startDate) {
      errors.push('Start date is required');
    }
    
    if (rule.interval < 1) {
      errors.push('Interval must be at least 1');
    }
    
    // Check end date is after start date
    if (rule.endDate && rule.startDate && rule.endDate <= rule.startDate) {
      errors.push('End date must be after start date');
    }
    
    // Type-specific validations
    if (rule.type === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length === 0) {
      errors.push('At least one day of the week must be selected for weekly recurrence');
    }
    
    if (rule.type === 'monthly' && rule.monthlyPattern === 'date' && !rule.dayOfMonth) {
      errors.push('Day of month is required for monthly date pattern');
    }
    
    if (rule.type === 'monthly' && rule.monthlyPattern === 'day-of-week') {
      if (!rule.weekOfMonth) {
        errors.push('Week of month is required for monthly day-of-week pattern');
      }
      if (!rule.dayOfWeekInMonth) {
        errors.push('Day of week is required for monthly day-of-week pattern');
      }
    }
    
    if (rule.type === 'yearly' && rule.monthOfYear && (rule.monthOfYear < 1 || rule.monthOfYear > 12)) {
      errors.push('Month of year must be between 1 and 12');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}