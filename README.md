# 🗓️ Recurring Date Picker Component – React/Next.js

A reusable and customizable recurring date picker component inspired by the **TickTick** scheduling UI. Built using **Next.js**, **Tailwind CSS**, and **Zustand** for clean state management.

## 🔗 Live Demo



---

## ✨ Features

- ✅ Supports **Daily, Weekly, Monthly, and Yearly** recurrence
- 🔁 Flexible customization:
  - Every X days/weeks/months/years
  - Specific weekdays (Mon, Wed, Fri, etc.)
  - Patterns like "Second Tuesday of every month"
- 📆 Date range selection (start date required, end date optional)
- 🗓️ Mini calendar preview showing selected recurring dates
- 🧠 Clean state handling using **Zustand**
- 💅 Styled with **Tailwind CSS**
- 🧪 Includes **unit & integration tests**

---

## 🧱 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/swathipriya37/recurring-date-wizard.git
cd recurring-date-wizard
```
2. Install Dependencies
bash ```
npm install
# or
yarn install
```
3. Start the Development Server
```
npm run dev
# or
yarn dev
```
Open http://localhost:3000 to view it in your browser.

🧩 Component Structure
```
components/
│
├── RecurrenceSelector.tsx         # UI for Daily/Weekly/Monthly/Yearly
├── CustomRuleInput.tsx            # Every X days/weeks/months/years
├── WeekdaySelector.tsx            # For choosing specific weekdays
├── PatternSelector.tsx            # e.g., "Second Tuesday of each month"
├── DateRangePicker.tsx            # Start/End date selection
├── CalendarPreview.tsx            # Displays recurring dates on calendar
├── utils/                         # Date generation & helper logic
└── store/useRecurrenceStore.ts    # Zustand store
```
🧪 Testing
Run tests with:

```
npm run test
```
## ✅ Unit Tests: Validate recurrence logic and utility functions

## 🔄 Integration Test: Ensures full flow from selection → preview

## 📹 Loom Video Overview
In the walkthrough, I explain:

How the recurrence logic works

State structure and usage of Zustand

Tailwind-based layout decisions

How calendar preview is generated

Extensibility for future rules

Test strategy and coverage

▶️ Watch the Video

📌 Future Improvements
Add iCal or Google Calendar export

Add timezone support

Enable saving recurrence rules

Enhance accessibility with keyboard navigation

🧑‍💻 Author
Made with ❤️ by Your Name

📄 License
This project is open source and available under the MIT License.

