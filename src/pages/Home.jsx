import { useMemo, useState } from "react";
import moment from "moment";
import { CalendarDays, CreditCard, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import BudgetDialog from "@/components/BudgetDialog";
import ExpenseCard from "@/components/ExpenseCard";
import InstallAppButton from "@/components/InstallAppButton";
import SpendingChart from "@/components/SpendingChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EXPENSE_CATEGORIES } from "@/data/categories";
import { cn, currency } from "@/lib/utils";

const EXPENSES_KEY = "student-expense-tracker-expenses";
const BUDGETS_KEY = "student-expense-tracker-budgets";

const sampleExpenses = [
  {
    id: "seed-1",
    title: "Shared groceries",
    amount: 46.2,
    category: "Food & Drinks",
    date: moment().date(3).format("YYYY-MM-DD"),
    notes: "Meal prep for the week",
  },
  {
    id: "seed-2",
    title: "Bus card top up",
    amount: 28,
    category: "Transport",
    date: moment().date(6).format("YYYY-MM-DD"),
    notes: "",
  },
  {
    id: "seed-3",
    title: "Statistics workbook",
    amount: 64,
    category: "Education",
    date: moment().date(9).format("YYYY-MM-DD"),
    notes: "Required reading",
  },
  {
    id: "seed-4",
    title: "Streaming split",
    amount: 11,
    category: "Entertainment",
    date: moment().date(12).format("YYYY-MM-DD"),
    notes: "",
  },
];

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Home() {
  const currentMonth = moment().format("YYYY-MM");
  const [expenses, setExpenses] = useState(() => readStorage(EXPENSES_KEY, sampleExpenses));
  const [budgets, setBudgets] = useState(() =>
    readStorage(BUDGETS_KEY, {
      [currentMonth]: {
        monthly_budget: 1200,
        month: currentMonth,
      },
    })
  );
  const [editingExpense, setEditingExpense] = useState(null);

  const activeBudget = budgets[currentMonth] || {
    monthly_budget: 0,
    month: currentMonth,
  };

  const monthlyExpenses = useMemo(
    () => expenses.filter((expense) => moment(expense.date).format("YYYY-MM") === currentMonth),
    [expenses, currentMonth]
  );

  const recentExpenses = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
        .slice(0, 6),
    [expenses]
  );

  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const remainingBudget = activeBudget.monthly_budget - totalSpent;
  const usedPercent = activeBudget.monthly_budget > 0 ? Math.min((totalSpent / activeBudget.monthly_budget) * 100, 100) : 0;
  const overBudget = remainingBudget < 0;

  function saveExpenses(nextExpenses) {
    setExpenses(nextExpenses);
    writeStorage(EXPENSES_KEY, nextExpenses);
  }

  function handleSaveExpense(expense) {
    const nextExpenses = expenses.some((item) => item.id === expense.id)
      ? expenses.map((item) => (item.id === expense.id ? expense : item))
      : [expense, ...expenses];
    saveExpenses(nextExpenses);
  }

  function handleDeleteExpense(expenseId) {
    saveExpenses(expenses.filter((expense) => expense.id !== expenseId));
  }

  function handleSaveBudget(budget) {
    const nextBudgets = {
      ...budgets,
      [budget.month]: budget,
    };
    setBudgets(nextBudgets);
    writeStorage(BUDGETS_KEY, nextBudgets);
  }

  const summaryCards = [
    {
      label: "Monthly budget",
      value: currency(activeBudget.monthly_budget),
      icon: Wallet,
      tone: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Spent this month",
      value: currency(totalSpent),
      icon: CreditCard,
      tone: "bg-blue-100 text-blue-700",
    },
    {
      label: "Remaining",
      value: currency(remainingBudget),
      icon: PiggyBank,
      tone: overBudget ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
    },
    {
      label: "Budget used",
      value: `${Math.round(usedPercent)}%`,
      icon: TrendingUp,
      tone: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <main className="dashboard-bg min-h-screen">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 rounded-3xl border bg-white/80 p-5 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {moment().format("MMMM YYYY")}
            </div>
            <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Student Expense Tracker</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-muted-foreground sm:text-base">
              Keep campus spending visible, simple, and under control.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <InstallAppButton />
            <BudgetDialog budget={activeBudget} onSave={handleSaveBudget} />
            <AddExpenseDialog expense={editingExpense} onSave={handleSaveExpense} onDone={() => setEditingExpense(null)} />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <span className={cn("grid h-12 w-12 place-items-center rounded-2xl", card.tone)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
                    <p className="mt-1 truncate text-2xl font-black">{card.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Monthly progress</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {overBudget ? `${currency(Math.abs(remainingBudget))} over budget` : `${currency(remainingBudget)} left this month`}
                </p>
              </div>
              <p className="text-sm font-black">{Math.round(usedPercent)}%</p>
            </div>
            <Progress value={usedPercent} className={overBudget ? "[&>div]:bg-destructive" : ""} />
          </CardContent>
        </Card>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SpendingChart expenses={monthlyExpenses} />

          <Card>
            <CardHeader>
              <CardTitle>Recent expenses</CardTitle>
              <CardDescription>Latest activity across your student budget</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {recentExpenses.length ? (
                recentExpenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={setEditingExpense}
                    onDelete={handleDeleteExpense}
                  />
                ))
              ) : (
                <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed text-center text-sm text-muted-foreground">
                  No expenses yet. Add your first one to start tracking.
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-3 rounded-3xl border bg-white/70 p-4 shadow-soft backdrop-blur">
          <h2 className="text-lg font-black">Categories</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {EXPENSE_CATEGORIES.map((category) => {
              const categoryTotal = monthlyExpenses
                .filter((expense) => expense.category === category)
                .reduce((sum, expense) => sum + Number(expense.amount), 0);
              return (
                <div key={category} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span className="text-sm font-bold">{category}</span>
                  <span className="text-sm font-black">{currency(categoryTotal)}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}