import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useRecurrence } from '@/contexts/RecurrenceContext';

export function DateRangePicker() {
  const { state, setStartDate, setEndDate } = useRecurrence();
  const { rule } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Date Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !rule.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {rule.startDate ? format(rule.startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={rule.startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>End Date (Optional)</Label>
            {rule.endDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEndDate(undefined)}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !rule.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {rule.endDate ? format(rule.endDate, "PPP") : <span>No end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={rule.endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => date <= rule.startDate}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 bg-accent rounded-lg text-sm">
          <p className="text-accent-foreground">
            {rule.endDate 
              ? `Recurring from ${format(rule.startDate, "MMM d, yyyy")} to ${format(rule.endDate, "MMM d, yyyy")}`
              : `Recurring from ${format(rule.startDate, "MMM d, yyyy")} onwards`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}