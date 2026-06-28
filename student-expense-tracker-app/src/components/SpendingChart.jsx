import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_STYLES, EXPENSE_CATEGORIES } from "@/data/categories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/lib/utils";

export default function SpendingChart({ expenses }) {
  const data = EXPENSE_CATEGORIES.map((category) => ({
    name: category,
    value: expenses
      .filter((expense) => expense.category === category)
      .reduce((total, expense) => total + Number(expense.amount), 0),
  })).filter((item) => item.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
        <CardDescription>Your monthly expense mix</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length ? (
          <div className="grid gap-4 lg:grid-cols-[240px_1fr] lg:items-center">
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={98} paddingAngle={3}>
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_STYLES[entry.name].color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => currency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Total</p>
                  <p className="text-xl font-black">{currency(total)}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CATEGORY_STYLES[item.name].color }} />
                    <span className="truncate text-sm font-semibold">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{currency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid h-64 place-items-center rounded-2xl border border-dashed text-center text-sm text-muted-foreground">
            Add an expense to see your category chart.
          </div>
        )}
      </CardContent>
    </Card>
  );
}