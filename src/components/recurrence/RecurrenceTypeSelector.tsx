import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecurrenceType } from '@/types/recurrence';
import { useRecurrence } from '@/contexts/RecurrenceContext';
import { Calendar, CalendarDays, Clock, RotateCcw } from 'lucide-react';

const recurrenceOptions: { type: RecurrenceType; label: string; icon: React.ReactNode }[] = [
  { type: 'daily', label: 'Daily', icon: <Clock className="h-4 w-4" /> },
  { type: 'weekly', label: 'Weekly', icon: <Calendar className="h-4 w-4" /> },
  { type: 'monthly', label: 'Monthly', icon: <CalendarDays className="h-4 w-4" /> },
  { type: 'yearly', label: 'Yearly', icon: <RotateCcw className="h-4 w-4" /> },
];

export function RecurrenceTypeSelector() {
  const { state, setRecurrenceType } = useRecurrence();

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Recurrence Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {recurrenceOptions.map((option) => (
            <Button
              key={option.type}
              variant={state.rule.type === option.type ? "default" : "outline"}
              size="sm"
              onClick={() => setRecurrenceType(option.type)}
              className="justify-start gap-2"
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}