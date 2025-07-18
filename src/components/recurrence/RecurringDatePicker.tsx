import React from 'react';
import { RecurrenceProvider } from '@/contexts/RecurrenceContext';
import { RecurrenceTypeSelector } from './RecurrenceTypeSelector';
import { CustomizationPanel } from './CustomizationPanel';
import { DateRangePicker } from './DateRangePicker';
import { MiniCalendarPreview } from './MiniCalendarPreview';
import { RecurrenceExamples } from './RecurrenceExamples';
import { DatesSummary } from './DatesSummary';

export function RecurringDatePicker() {
  return (
    <RecurrenceProvider>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Recurring Date Picker
          </h1>
          <p className="text-muted-foreground">
            Create complex recurring date patterns with ease
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <RecurrenceTypeSelector />
            <CustomizationPanel />
            <DateRangePicker />
          </div>
          
          {/* Preview Panel */}
          <div className="space-y-6">
            <MiniCalendarPreview />
            <RecurrenceExamples />
          </div>
          
          {/* Summary Panel */}
          <div>
            <DatesSummary />
          </div>
        </div>
      </div>
    </RecurrenceProvider>
  );
}