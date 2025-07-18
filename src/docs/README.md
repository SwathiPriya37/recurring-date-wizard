# Recurring Date Picker Component

A powerful, flexible React component for creating complex recurring date patterns, similar to the functionality found in TickTick and other scheduling applications.

## 🚀 Features

### Recurrence Types
- **Daily**: Every X days
- **Weekly**: Specific days of the week, every X weeks
- **Monthly**: By date or by day of week (e.g., "2nd Tuesday"), every X months
- **Yearly**: Specific month and day, every X years

### Advanced Customization
- **Flexible Intervals**: Every 1, 2, 3... days/weeks/months/years
- **Day Selection**: Choose specific days of the week for weekly recurrence
- **Monthly Patterns**: 
  - By specific date (e.g., 15th of every month)
  - By day of week (e.g., first Monday, last Friday)
- **Date Range**: Optional start and end dates

### Visual Preview
- **Mini Calendar**: Interactive calendar showing all recurring dates
- **Color Coding**: Different colors for start, recurring, and end dates
- **Month Navigation**: Browse through different months to see future occurrences
- **Legend**: Clear visual indicators for different date types

## 📁 Component Structure

```
src/
├── components/recurrence/
│   ├── RecurringDatePicker.tsx      # Main component container
│   ├── RecurrenceTypeSelector.tsx   # Daily/Weekly/Monthly/Yearly selector
│   ├── CustomizationPanel.tsx       # Interval and pattern options
│   ├── DateRangePicker.tsx          # Start/end date selection
│   └── MiniCalendarPreview.tsx      # Visual calendar preview
├── contexts/
│   └── RecurrenceContext.tsx        # State management
├── types/
│   └── recurrence.ts                # TypeScript type definitions
├── utils/
│   └── recurrence-logic.ts          # Core date generation logic
└── __tests__/
    ├── recurrence-logic.test.ts     # Unit tests for date logic
    └── RecurrenceContext.test.tsx   # Integration tests
```

## 🎯 Usage

### Basic Usage

```tsx
import { RecurringDatePicker } from '@/components/recurrence/RecurringDatePicker';

function App() {
  return (
    <div>
      <RecurringDatePicker />
    </div>
  );
}
```

### Using the Context

```tsx
import { RecurrenceProvider, useRecurrence } from '@/contexts/RecurrenceContext';

function MyComponent() {
  const { state, setRecurrenceType, setInterval } = useRecurrence();
  
  return (
    <div>
      <p>Current rule: {state.rule.type} every {state.rule.interval}</p>
      <p>Generated dates: {state.generatedDates.length}</p>
    </div>
  );
}

function App() {
  return (
    <RecurrenceProvider>
      <MyComponent />
    </RecurrenceProvider>
  );
}
```

## 🔧 API Reference

### RecurrenceRule Type

```typescript
interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  startDate: Date;
  endDate?: Date;
  
  // Weekly specific
  daysOfWeek?: DayOfWeek[];
  
  // Monthly specific
  monthlyPattern?: 'date' | 'day-of-week';
  dayOfMonth?: number;
  weekOfMonth?: 'first' | 'second' | 'third' | 'fourth' | 'last';
  dayOfWeekInMonth?: DayOfWeek;
  
  // Yearly specific
  monthOfYear?: number;
}
```

### Context Actions

```typescript
// Change recurrence type
setRecurrenceType('weekly');

// Set interval
setInterval(2); // Every 2 weeks/months/etc

// Set date range
setStartDate(new Date('2024-01-01'));
setEndDate(new Date('2024-12-31'));

// Weekly: Set days of week
setDaysOfWeek(['monday', 'wednesday', 'friday']);

// Monthly: Set pattern
setMonthlyPattern('day-of-week');
setWeekOfMonth('second');
setDayOfWeekInMonth('tuesday');
```

## 📋 Examples

### Every Tuesday and Thursday

```typescript
const rule: RecurrenceRule = {
  type: 'weekly',
  interval: 1,
  startDate: new Date('2024-01-01'),
  daysOfWeek: ['tuesday', 'thursday']
};
```

### Second Tuesday of Every Month

```typescript
const rule: RecurrenceRule = {
  type: 'monthly',
  interval: 1,
  startDate: new Date('2024-01-01'),
  monthlyPattern: 'day-of-week',
  weekOfMonth: 'second',
  dayOfWeekInMonth: 'tuesday'
};
```

### Every 3 Days

```typescript
const rule: RecurrenceRule = {
  type: 'daily',
  interval: 3,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-06-01')
};
```

### Annual Birthday

```typescript
const rule: RecurrenceRule = {
  type: 'yearly',
  interval: 1,
  startDate: new Date('2024-03-15'),
  monthOfYear: 3,
  dayOfMonth: 15
};
```

## 🎨 Styling

The component uses a semantic design system with CSS custom properties:

```css
:root {
  --calendar-selected: 217 91% 60%;
  --calendar-recurring: 217 91% 85%;
  --calendar-today: 217 91% 95%;
  --gradient-primary: linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%));
}
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

### Test Coverage

- **Unit Tests**: Core date generation logic
- **Integration Tests**: Context state management
- **Validation Tests**: Rule validation and error handling

## 🏗️ Architecture Decisions

### State Management
- **React Context**: Chosen for component-wide state management
- **useReducer**: Complex state updates with automatic date generation
- **Custom Hooks**: Clean API for accessing context actions

### Date Logic
- **Separation of Concerns**: Business logic separated from UI components
- **Generator Class**: Encapsulates all date generation algorithms
- **Validation**: Built-in rule validation with error messages

### Performance
- **Memoization**: Calendar preview memoizes expensive calculations
- **Limited Generation**: Generates max 50 dates to prevent performance issues
- **Efficient Rendering**: Only re-renders when necessary

## 🚀 Future Enhancements

- **Time Support**: Add time-based recurrence (hourly, every 30 minutes)
- **Exclusions**: Skip specific dates (holidays, weekends)
- **iCal Export**: Export to calendar format
- **Presets**: Common patterns (weekdays only, business hours)
- **Timezone Support**: Handle different timezones
- **Performance**: Virtual scrolling for large date ranges

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.