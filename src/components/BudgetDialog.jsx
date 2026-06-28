import { useEffect, useState } from "react";
import moment from "moment";
import { WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BudgetDialog({ budget, onSave }) {
  const [open, setOpen] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [month, setMonth] = useState(moment().format("YYYY-MM"));

  useEffect(() => {
    setMonthlyBudget(budget?.monthly_budget ? String(budget.monthly_budget) : "");
    setMonth(budget?.month || moment().format("YYYY-MM"));
  }, [budget]);

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      monthly_budget: Number(monthlyBudget),
      month,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <WalletCards className="h-4 w-4" />
          Set budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Monthly budget</DialogTitle>
          <DialogDescription>Set the spending limit for the month you want to review.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="budget-month">Month</Label>
            <Input id="budget-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthly-budget">Budget amount</Label>
            <Input
              id="monthly-budget"
              type="number"
              min="0"
              step="1"
              value={monthlyBudget}
              onChange={(event) => setMonthlyBudget(event.target.value)}
              placeholder="1200"
              required
            />
          </div>
          <Button type="submit">Save budget</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}