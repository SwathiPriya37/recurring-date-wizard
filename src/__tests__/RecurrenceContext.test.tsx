import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { RecurrenceProvider, useRecurrence } from '@/contexts/RecurrenceContext';

// Test component that uses the context
function TestComponent() {
  const { state, setRecurrenceType, setInterval } = useRecurrence();
  
  return (
    <div>
      <div data-testid="recurrence-type">{state.rule.type}</div>
      <div data-testid="interval">{state.rule.interval}</div>
      <div data-testid="valid">{state.isValid.toString()}</div>
      <div data-testid="dates-count">{state.generatedDates.length}</div>
      <button onClick={() => setRecurrenceType('daily')} data-testid="set-daily">
        Set Daily
      </button>
      <button onClick={() => setInterval(3)} data-testid="set-interval">
        Set Interval 3
      </button>
    </div>
  );
}

describe('RecurrenceContext', () => {
  it('should provide initial state', () => {
    const { container } = render(
      <RecurrenceProvider>
        <TestComponent />
      </RecurrenceProvider>
    );
    
    const recurrenceType = container.querySelector('[data-testid="recurrence-type"]');
    const interval = container.querySelector('[data-testid="interval"]');
    const valid = container.querySelector('[data-testid="valid"]');
    
    expect(recurrenceType?.textContent).toBe('weekly');
    expect(interval?.textContent).toBe('1');
    expect(valid?.textContent).toBe('true');
  });

  it('should generate dates by default', () => {
    const { container } = render(
      <RecurrenceProvider>
        <TestComponent />
      </RecurrenceProvider>
    );
    
    const datesCount = container.querySelector('[data-testid="dates-count"]');
    const count = parseInt(datesCount?.textContent || '0');
    
    // Should have at least start date + some recurring dates
    expect(count).toBeGreaterThan(1);
  });

  it('should update recurrence type when action is called', () => {
    const { container } = render(
      <RecurrenceProvider>
        <TestComponent />
      </RecurrenceProvider>
    );
    
    const button = container.querySelector('[data-testid="set-daily"]') as HTMLButtonElement;
    const recurrenceType = container.querySelector('[data-testid="recurrence-type"]');
    
    // Initially weekly
    expect(recurrenceType?.textContent).toBe('weekly');
    
    // Click button to change to daily
    button.click();
    
    // Should now be daily
    expect(recurrenceType?.textContent).toBe('daily');
  });

  it('should update interval when action is called', () => {
    const { container } = render(
      <RecurrenceProvider>
        <TestComponent />
      </RecurrenceProvider>
    );
    
    const button = container.querySelector('[data-testid="set-interval"]') as HTMLButtonElement;
    const interval = container.querySelector('[data-testid="interval"]');
    
    // Initially 1
    expect(interval?.textContent).toBe('1');
    
    // Click button to change to 3
    button.click();
    
    // Should now be 3
    expect(interval?.textContent).toBe('3');
  });
});