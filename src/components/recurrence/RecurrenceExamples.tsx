import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { useRecurrence } from '@/contexts/RecurrenceContext';
import { RecurrenceRule } from '@/types/recurrence';

const exampleRules: { name: string; description: string; rule: Partial<RecurrenceRule>; icon: React.ReactNode }[] = [
  {
    name: 'Daily Standup',
    description: 'Every weekday at 9 AM',
    icon: <Clock className="h-4 w-4" />,
    rule: {
      type: 'weekly',
      interval: 1,
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    },
  },
  {
    name: 'Monthly Team Meeting',
    description: 'First Monday of every month',
    icon: <Calendar className="h-4 w-4" />,
    rule: {
      type: 'monthly',
      interval: 1,
      monthlyPattern: 'day-of-week',
      weekOfMonth: 'first',
      dayOfWeekInMonth: 'monday',
    },
  },
  {
    name: 'Quarterly Review',
    description: 'Every 3 months on the 15th',
    icon: <Repeat className="h-4 w-4" />,
    rule: {
      type: 'monthly',
      interval: 3,
      monthlyPattern: 'date',
      dayOfMonth: 15,
    },
  },
  {
    name: 'Weekend Workout',
    description: 'Every Saturday and Sunday',
    icon: <Calendar className="h-4 w-4" />,
    rule: {
      type: 'weekly',
      interval: 1,
      daysOfWeek: ['saturday', 'sunday'],
    },
  },
  {
    name: 'Annual Birthday',
    description: 'Same date every year',
    icon: <Calendar className="h-4 w-4" />,
    rule: {
      type: 'yearly',
      interval: 1,
      monthOfYear: 6,
      dayOfMonth: 15,
    },
  },
  {
    name: 'Every Other Day',
    description: 'Every 2 days',
    icon: <Clock className="h-4 w-4" />,
    rule: {
      type: 'daily',
      interval: 2,
    },
  },
];

export function RecurrenceExamples() {
  const { state, dispatch } = useRecurrence();

  const applyExample = (exampleRule: Partial<RecurrenceRule>) => {
    // Apply the example rule by dispatching multiple actions
    const fullRule = {
      ...state.rule,
      ...exampleRule,
      startDate: new Date(), // Always use current date as start
    };

    // Reset and apply new rule
    dispatch({ type: 'RESET' });
    
    // Apply each property
    if (fullRule.type) {
      dispatch({ type: 'SET_RECURRENCE_TYPE', payload: fullRule.type });
    }
    if (fullRule.interval) {
      dispatch({ type: 'SET_INTERVAL', payload: fullRule.interval });
    }
    if (fullRule.daysOfWeek) {
      dispatch({ type: 'SET_DAYS_OF_WEEK', payload: fullRule.daysOfWeek });
    }
    if (fullRule.monthlyPattern) {
      dispatch({ type: 'SET_MONTHLY_PATTERN', payload: fullRule.monthlyPattern });
    }
    if (fullRule.dayOfMonth) {
      dispatch({ type: 'SET_DAY_OF_MONTH', payload: fullRule.dayOfMonth });
    }
    if (fullRule.weekOfMonth) {
      dispatch({ type: 'SET_WEEK_OF_MONTH', payload: fullRule.weekOfMonth });
    }
    if (fullRule.dayOfWeekInMonth) {
      dispatch({ type: 'SET_DAY_OF_WEEK_IN_MONTH', payload: fullRule.dayOfWeekInMonth });
    }
    if (fullRule.monthOfYear) {
      dispatch({ type: 'SET_MONTH_OF_YEAR', payload: fullRule.monthOfYear });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          Quick Examples
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Try these common recurring patterns
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {exampleRules.map((example, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">
                {example.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium">{example.name}</h4>
                <p className="text-xs text-muted-foreground">{example.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {example.rule.type}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyExample(example.rule)}
                className="text-xs"
              >
                Try It
              </Button>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Current Pattern Summary</h4>
          <p className="text-xs text-muted-foreground">
            <strong>{state.rule.type.charAt(0).toUpperCase() + state.rule.type.slice(1)}</strong>
            {' '}every {state.rule.interval} {state.rule.type === 'daily' ? 'day(s)' : 
              state.rule.type === 'weekly' ? 'week(s)' : 
              state.rule.type === 'monthly' ? 'month(s)' : 'year(s)'}
            {state.rule.daysOfWeek && state.rule.daysOfWeek.length > 0 && (
              <> on {state.rule.daysOfWeek.join(', ')}</>
            )}
            {state.rule.monthlyPattern === 'day-of-week' && state.rule.weekOfMonth && state.rule.dayOfWeekInMonth && (
              <> on the {state.rule.weekOfMonth} {state.rule.dayOfWeekInMonth}</>
            )}
            {state.rule.monthlyPattern === 'date' && state.rule.dayOfMonth && (
              <> on the {state.rule.dayOfMonth}{state.rule.dayOfMonth === 1 ? 'st' : 
                state.rule.dayOfMonth === 2 ? 'nd' : 
                state.rule.dayOfMonth === 3 ? 'rd' : 'th'}</>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Generating {state.generatedDates.length} occurrences
          </p>
        </div>
      </CardContent>
    </Card>
  );
}