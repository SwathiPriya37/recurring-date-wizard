export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type MonthlyPattern = 'date' | 'day-of-week';

export type WeekOfMonth = 'first' | 'second' | 'third' | 'fourth' | 'last';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number; // Every X days/weeks/months/years
  startDate: Date;
  endDate?: Date;
  
  // Weekly specific
  daysOfWeek?: DayOfWeek[];
  
  // Monthly specific
  monthlyPattern?: MonthlyPattern;
  dayOfMonth?: number; // For 'date' pattern
  weekOfMonth?: WeekOfMonth; // For 'day-of-week' pattern
  dayOfWeekInMonth?: DayOfWeek; // For 'day-of-week' pattern (e.g., "second Tuesday")
  
  // Yearly specific
  monthOfYear?: number; // 1-12
}

export interface GeneratedDate {
  date: Date;
  type: 'recurring' | 'start' | 'end';
}

export interface RecurrenceState {
  rule: RecurrenceRule;
  generatedDates: GeneratedDate[];
  isValid: boolean;
  errors: string[];
}