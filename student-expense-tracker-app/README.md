# Student Expense Tracker

A mobile-friendly React web application designed to help students track expenses, manage monthly budgets, and review spending by category.

## Features

- Add, edit, and delete expenses
- Set a monthly budget
- Track total monthly spending
- View remaining budget and budget usage percentage
- Review recent expenses
- View spending by category using a chart
- Stores data locally in the browser using localStorage
- Includes basic PWA support with manifest and service worker

## Technologies

- React
- Vite
- JavaScript
- Tailwind CSS
- Recharts
- Moment.js
- Radix UI
- Lucide React

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm run dev
```

Open the localhost link shown in the terminal, usually:

```text
http://localhost:5173/
```

### 3. Build the app

```bash
npm run build
```

### 4. Preview the built app

```bash
npm run preview
```

This usually opens at:

```text
http://127.0.0.1:4173/
```

## Project Structure

```text
student-expense-tracker/
├── public/
│   ├── icons/
│   ├── manifest.webmanifest
│   └── sw.js
├── src/
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Author

Virgilion
