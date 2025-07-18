import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { RecurrenceRule, RecurrenceState, GeneratedDate, RecurrenceType, DayOfWeek } from '@/types/recurrence';
import { RecurrenceGenerator } from '@/utils/recurrence-logic';

type RecurrenceAction =
  | { type: 'SET_RECURRENCE_TYPE'; payload: RecurrenceType }
  | { type: 'SET_INTERVAL'; payload: number }
  | { type: 'SET_START_DATE'; payload: Date }
  | { type: 'SET_END_DATE'; payload: Date | undefined }
  | { type: 'SET_DAYS_OF_WEEK'; payload: DayOfWeek[] }
  | { type: 'SET_MONTHLY_PATTERN'; payload: 'date' | 'day-of-week' }
  | { type: 'SET_DAY_OF_MONTH'; payload: number }
  | { type: 'SET_WEEK_OF_MONTH'; payload: 'first' | 'second' | 'third' | 'fourth' | 'last' }
  | { type: 'SET_DAY_OF_WEEK_IN_MONTH'; payload: DayOfWeek }
  | { type: 'SET_MONTH_OF_YEAR'; payload: number }
  | { type: 'GENERATE_DATES' }
  | { type: 'RESET' };

const initialRule: RecurrenceRule = {
  type: 'weekly',
  interval: 1,
  startDate: new Date(),
  daysOfWeek: ['monday'],
};

const initialState: RecurrenceState = {
  rule: initialRule,
  generatedDates: [],
  isValid: true,
  errors: [],
};

function recurrenceReducer(state: RecurrenceState, action: RecurrenceAction): RecurrenceState {
  let newRule = { ...state.rule };
  
  switch (action.type) {
    case 'SET_RECURRENCE_TYPE':
      newRule.type = action.payload;
      // Reset type-specific properties when changing type
      if (action.payload !== 'weekly') {
        delete newRule.daysOfWeek;
      }
      if (action.payload !== 'monthly') {
        delete newRule.monthlyPattern;
        delete newRule.dayOfMonth;
        delete newRule.weekOfMonth;
        delete newRule.dayOfWeekInMonth;
      }
      if (action.payload !== 'yearly') {
        delete newRule.monthOfYear;
      }
      // Set sensible defaults
      if (action.payload === 'weekly' && !newRule.daysOfWeek) {
        newRule.daysOfWeek = ['monday'];
      }
      if (action.payload === 'monthly') {
        newRule.monthlyPattern = 'date';
        newRule.dayOfMonth = newRule.startDate.getDate();
      }
      if (action.payload === 'yearly') {
        newRule.monthOfYear = newRule.startDate.getMonth() + 1;
        newRule.dayOfMonth = newRule.startDate.getDate();
      }
      break;
      
    case 'SET_INTERVAL':
      newRule.interval = Math.max(1, action.payload);
      break;
      
    case 'SET_START_DATE':
      newRule.startDate = action.payload;
      break;
      
    case 'SET_END_DATE':
      newRule.endDate = action.payload;
      break;
      
    case 'SET_DAYS_OF_WEEK':
      newRule.daysOfWeek = action.payload;
      break;
      
    case 'SET_MONTHLY_PATTERN':
      newRule.monthlyPattern = action.payload;
      if (action.payload === 'date') {
        newRule.dayOfMonth = newRule.startDate.getDate();
        delete newRule.weekOfMonth;
        delete newRule.dayOfWeekInMonth;
      } else {
        delete newRule.dayOfMonth;
        newRule.weekOfMonth = 'first';
        newRule.dayOfWeekInMonth = 'monday';
      }
      break;
      
    case 'SET_DAY_OF_MONTH':
      newRule.dayOfMonth = action.payload;
      break;
      
    case 'SET_WEEK_OF_MONTH':
      newRule.weekOfMonth = action.payload;
      break;
      
    case 'SET_DAY_OF_WEEK_IN_MONTH':
      newRule.dayOfWeekInMonth = action.payload;
      break;
      
    case 'SET_MONTH_OF_YEAR':
      newRule.monthOfYear = action.payload;
      break;
      
    case 'GENERATE_DATES':
      const validation = RecurrenceGenerator.validateRule(newRule);
      if (validation.isValid) {
        const generatedDates = RecurrenceGenerator.generate(newRule, 50);
        return {
          ...state,
          rule: newRule,
          generatedDates,
          isValid: true,
          errors: [],
        };
      } else {
        return {
          ...state,
          rule: newRule,
          generatedDates: [],
          isValid: false,
          errors: validation.errors,
        };
      }
      
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
  
  // Auto-generate dates for most changes
  const validation = RecurrenceGenerator.validateRule(newRule);
  if (validation.isValid) {
    const generatedDates = RecurrenceGenerator.generate(newRule, 50);
    return {
      ...state,
      rule: newRule,
      generatedDates,
      isValid: true,
      errors: [],
    };
  } else {
    return {
      ...state,
      rule: newRule,
      generatedDates: [],
      isValid: false,
      errors: validation.errors,
    };
  }
}

interface RecurrenceContextType {
  state: RecurrenceState;
  dispatch: React.Dispatch<RecurrenceAction>;
  setRecurrenceType: (type: RecurrenceType) => void;
  setInterval: (interval: number) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | undefined) => void;
  setDaysOfWeek: (days: DayOfWeek[]) => void;
  setMonthlyPattern: (pattern: 'date' | 'day-of-week') => void;
  setDayOfMonth: (day: number) => void;
  setWeekOfMonth: (week: 'first' | 'second' | 'third' | 'fourth' | 'last') => void;
  setDayOfWeekInMonth: (day: DayOfWeek) => void;
  setMonthOfYear: (month: number) => void;
  generateDates: () => void;
  reset: () => void;
}

const RecurrenceContext = createContext<RecurrenceContextType | undefined>(undefined);

export function RecurrenceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recurrenceReducer, initialState);
  
  const contextValue: RecurrenceContextType = {
    state,
    dispatch,
    setRecurrenceType: (type) => dispatch({ type: 'SET_RECURRENCE_TYPE', payload: type }),
    setInterval: (interval) => dispatch({ type: 'SET_INTERVAL', payload: interval }),
    setStartDate: (date) => dispatch({ type: 'SET_START_DATE', payload: date }),
    setEndDate: (date) => dispatch({ type: 'SET_END_DATE', payload: date }),
    setDaysOfWeek: (days) => dispatch({ type: 'SET_DAYS_OF_WEEK', payload: days }),
    setMonthlyPattern: (pattern) => dispatch({ type: 'SET_MONTHLY_PATTERN', payload: pattern }),
    setDayOfMonth: (day) => dispatch({ type: 'SET_DAY_OF_MONTH', payload: day }),
    setWeekOfMonth: (week) => dispatch({ type: 'SET_WEEK_OF_MONTH', payload: week }),
    setDayOfWeekInMonth: (day) => dispatch({ type: 'SET_DAY_OF_WEEK_IN_MONTH', payload: day }),
    setMonthOfYear: (month) => dispatch({ type: 'SET_MONTH_OF_YEAR', payload: month }),
    generateDates: () => dispatch({ type: 'GENERATE_DATES' }),
    reset: () => dispatch({ type: 'RESET' }),
  };
  
  return (
    <RecurrenceContext.Provider value={contextValue}>
      {children}
    </RecurrenceContext.Provider>
  );
}

export function useRecurrence() {
  const context = useContext(RecurrenceContext);
  if (context === undefined) {
    throw new Error('useRecurrence must be used within a RecurrenceProvider');
  }
  return context;
}