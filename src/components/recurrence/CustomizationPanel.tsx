import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRecurrence } from '@/contexts/RecurrenceContext';
import { DayOfWeek } from '@/types/recurrence';

const daysOfWeek: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
];

const weekOfMonth = [
  { value: 'first', label: 'First' },
  { value: 'second', label: 'Second' },
  { value: 'third', label: 'Third' },
  { value: 'fourth', label: 'Fourth' },
  { value: 'last', label: 'Last' },
] as const;

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CustomizationPanel() {
  const { state, setInterval, setDaysOfWeek, setMonthlyPattern, setDayOfMonth, setWeekOfMonth, setDayOfWeekInMonth, setMonthOfYear } = useRecurrence();
  const { rule } = state;

  const toggleDayOfWeek = (day: DayOfWeek) => {
    const currentDays = rule.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setDaysOfWeek(newDays);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interval Setting */}
        <div className="space-y-2">
          <Label htmlFor="interval">
            Every {rule.interval} {rule.type === 'daily' ? 'day(s)' : 
                     rule.type === 'weekly' ? 'week(s)' : 
                     rule.type === 'monthly' ? 'month(s)' : 'year(s)'}
          </Label>
          <Input
            id="interval"
            type="number"
            min="1"
            max="365"
            value={rule.interval}
            onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
            className="w-20"
          />
        </div>

        {/* Weekly Customization */}
        {rule.type === 'weekly' && (
          <div className="space-y-3">
            <Label>Days of the Week</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  variant={rule.daysOfWeek?.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDayOfWeek(day.value)}
                  className="text-xs"
                >
                  {day.short}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Customization */}
        {rule.type === 'monthly' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Monthly Pattern</Label>
              <div className="flex gap-2">
                <Button
                  variant={rule.monthlyPattern === 'date' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMonthlyPattern('date')}
                >
                  By Date
                </Button>
                <Button
                  variant={rule.monthlyPattern === 'day-of-week' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMonthlyPattern('day-of-week')}
                >
                  By Day of Week
                </Button>
              </div>
            </div>

            {rule.monthlyPattern === 'date' && (
              <div className="space-y-2">
                <Label htmlFor="dayOfMonth">Day of Month</Label>
                <Input
                  id="dayOfMonth"
                  type="number"
                  min="1"
                  max="31"
                  value={rule.dayOfMonth || 1}
                  onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
              </div>
            )}

            {rule.monthlyPattern === 'day-of-week' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Week</Label>
                    <Select
                      value={rule.weekOfMonth || 'first'}
                      onValueChange={(value: any) => setWeekOfMonth(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weekOfMonth.map((week) => (
                          <SelectItem key={week.value} value={week.value}>
                            {week.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Day</Label>
                    <Select
                      value={rule.dayOfWeekInMonth || 'monday'}
                      onValueChange={(value: any) => setDayOfWeekInMonth(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Yearly Customization */}
        {rule.type === 'yearly' && (
          <div className="space-y-3">
            <div>
              <Label>Month</Label>
              <Select
                value={(rule.monthOfYear || 1).toString()}
                onValueChange={(value) => setMonthOfYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="yearlyDay">Day</Label>
              <Input
                id="yearlyDay"
                type="number"
                min="1"
                max="31"
                value={rule.dayOfMonth || 1}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
                className="w-20"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}