import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRecurrence } from '@/contexts/RecurrenceContext';

export function MiniCalendarPreview() {
  const { state } = useRecurrence();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month to calculate grid offset
  const firstDayOfWeek = getDay(monthStart);

  // Create array of days including padding for previous month
  const calendarDays = useMemo(() => {
    const days = [];
    
    // Add padding days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual month days
    days.push(...monthDays);
    
    return days;
  }, [monthDays, firstDayOfWeek]);

  const recurringDates = useMemo(() => {
    return state.generatedDates.filter(gd => 
      gd.date >= monthStart && gd.date <= monthEnd
    );
  }, [state.generatedDates, monthStart, monthEnd]);

  const isRecurringDate = (date: Date) => {
    return recurringDates.some(rd => isSameDay(rd.date, date));
  };

  const getDateType = (date: Date) => {
    const found = recurringDates.find(rd => isSameDay(rd.date, date));
    return found?.type || null;
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Preview Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => (
            <div key={index} className="aspect-square">
              {date && (
                <div
                  className={cn(
                    "w-full h-full rounded-md flex items-center justify-center text-xs font-medium transition-colors",
                    isToday(date) && "bg-calendar-today text-calendar-today-foreground",
                    isRecurringDate(date) && !isToday(date) && getDateType(date) === 'recurring' && 
                      "bg-calendar-recurring text-calendar-recurring-foreground",
                    isRecurringDate(date) && getDateType(date) === 'start' && 
                      "bg-primary text-primary-foreground ring-2 ring-primary-glow",
                    isRecurringDate(date) && getDateType(date) === 'end' && 
                      "bg-destructive text-destructive-foreground",
                    !isRecurringDate(date) && !isToday(date) && "hover:bg-muted"
                  )}
                  title={
                    isRecurringDate(date) 
                      ? `Recurring date: ${format(date, 'PPP')}${getDateType(date) === 'start' ? ' (Start)' : getDateType(date) === 'end' ? ' (End)' : ''}`
                      : format(date, 'PPP')
                  }
                >
                  {date.getDate()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-4 pt-3 border-t">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span>Start Date</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-calendar-recurring"></div>
            <span>Recurring</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-calendar-today"></div>
            <span>Today</span>
          </div>
          {state.rule.endDate && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive"></div>
              <span>End Date</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Summary</h4>
          <p className="text-xs text-muted-foreground">
            {state.generatedDates.length > 0 
              ? `Showing ${recurringDates.length} occurrence${recurringDates.length !== 1 ? 's' : ''} in ${format(currentMonth, 'MMMM yyyy')}`
              : 'No recurring dates generated yet'
            }
          </p>
          {state.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-destructive">Errors:</p>
              <ul className="text-xs text-destructive list-disc list-inside">
                {state.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}