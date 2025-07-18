import { describe, it, expect } from 'vitest';
import { RecurrenceGenerator } from '@/utils/recurrence-logic';
import { RecurrenceRule } from '@/types/recurrence';

describe('RecurrenceGenerator', () => {
  describe('Daily Recurrence', () => {
    it('should generate daily recurring dates', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
      };

      const dates = RecurrenceGenerator.generate(rule, 10);
      
      expect(dates).toHaveLength(6); // start + 4 daily + end
      expect(dates[0].type).toBe('start');
      expect(dates[1].type).toBe('recurring');
      expect(dates[dates.length - 1].type).toBe('end');
    });

    it('should respect interval for daily recurrence', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 3,
        startDate: new Date('2024-01-01'),
      };

      const dates = RecurrenceGenerator.generate(rule, 3);
      
      expect(dates).toHaveLength(4); // start + 3 recurring
      expect(dates[1].date.getDate()).toBe(4); // Jan 4 (3 days after Jan 1)
      expect(dates[2].date.getDate()).toBe(7); // Jan 7
      expect(dates[3].date.getDate()).toBe(10); // Jan 10
    });
  });

  describe('Weekly Recurrence', () => {
    it('should generate weekly recurring dates', () => {
      const rule: RecurrenceRule = {
        type: 'weekly',
        interval: 1,
        startDate: new Date('2024-01-01'), // Monday
        daysOfWeek: ['monday'],
      };

      const dates = RecurrenceGenerator.generate(rule, 3);
      
      expect(dates).toHaveLength(4); // start + 3 recurring
      dates.slice(1).forEach(dateObj => {
        expect(dateObj.date.getDay()).toBe(1); // Monday
      });
    });

    it('should handle multiple days of week', () => {
      const rule: RecurrenceRule = {
        type: 'weekly',
        interval: 1,
        startDate: new Date('2024-01-01'), // Monday
        daysOfWeek: ['monday', 'wednesday', 'friday'],
      };

      const dates = RecurrenceGenerator.generate(rule, 6);
      
      expect(dates.length).toBeGreaterThan(4);
      
      // Check that generated dates are only on Monday, Wednesday, or Friday
      dates.slice(1).forEach(dateObj => {
        const dayOfWeek = dateObj.date.getDay();
        expect([1, 3, 5]).toContain(dayOfWeek); // Mon=1, Wed=3, Fri=5
      });
    });
  });

  describe('Monthly Recurrence', () => {
    it('should generate monthly recurring dates by date', () => {
      const rule: RecurrenceRule = {
        type: 'monthly',
        interval: 1,
        startDate: new Date('2024-01-15'),
        monthlyPattern: 'date',
        dayOfMonth: 15,
      };

      const dates = RecurrenceGenerator.generate(rule, 3);
      
      expect(dates).toHaveLength(4); // start + 3 recurring
      dates.forEach(dateObj => {
        expect(dateObj.date.getDate()).toBe(15);
      });
    });

    it('should generate monthly recurring dates by day of week', () => {
      const rule: RecurrenceRule = {
        type: 'monthly',
        interval: 1,
        startDate: new Date('2024-01-01'),
        monthlyPattern: 'day-of-week',
        weekOfMonth: 'first',
        dayOfWeekInMonth: 'monday',
      };

      const dates = RecurrenceGenerator.generate(rule, 3);
      
      expect(dates).toHaveLength(4); // start + 3 recurring
      
      // Check that all dates are Mondays
      dates.slice(1).forEach(dateObj => {
        expect(dateObj.date.getDay()).toBe(1); // Monday
      });
    });
  });

  describe('Yearly Recurrence', () => {
    it('should generate yearly recurring dates', () => {
      const rule: RecurrenceRule = {
        type: 'yearly',
        interval: 1,
        startDate: new Date('2024-01-15'),
        monthOfYear: 1,
        dayOfMonth: 15,
      };

      const dates = RecurrenceGenerator.generate(rule, 3);
      
      expect(dates).toHaveLength(4); // start + 3 recurring
      dates.forEach(dateObj => {
        expect(dateObj.date.getMonth()).toBe(0); // January (0-based)
        expect(dateObj.date.getDate()).toBe(15);
      });
    });
  });

  describe('Validation', () => {
    it('should validate valid rules', () => {
      const rule: RecurrenceRule = {
        type: 'weekly',
        interval: 1,
        startDate: new Date('2024-01-01'),
        daysOfWeek: ['monday'],
      };

      const validation = RecurrenceGenerator.validateRule(rule);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid rules', () => {
      const rule: RecurrenceRule = {
        type: 'weekly',
        interval: 0, // Invalid
        startDate: new Date('2024-01-01'),
        daysOfWeek: [], // Invalid for weekly
      };

      const validation = RecurrenceGenerator.validateRule(rule);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should detect end date before start date', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 1,
        startDate: new Date('2024-01-05'),
        endDate: new Date('2024-01-01'), // Before start date
      };

      const validation = RecurrenceGenerator.validateRule(rule);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('End date must be after start date');
    });
  });
});