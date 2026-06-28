import { useEffect, useState } from "react";
import moment from "moment";
import { Plus } from "lucide-react";
import { EXPENSE_CATEGORIES } from "@/data/categories";
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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  title: "",
  amount: "",
  category: "Food & Drinks",
  date: moment().format("YYYY-MM-DD"),
  notes: "",
};

export default function AddExpenseDialog({ expense, onSave, onDone }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const editing = Boolean(expense);

  useEffect(() => {
    if (expense) {
      setOpen(true);
      setForm({
        title: expense.title,
        amount: String(expense.amount),
        category: expense.category,
        date: expense.date,
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setForm(emptyForm);
      onDone?.();
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...expense,
      id: expense?.id || crypto.randomUUID(),
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      notes: form.notes.trim(),
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!editing ? (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
            Add expense
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit expense" : "Add expense"}</DialogTitle>
          <DialogDescription>Track a purchase and keep your student budget current.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="expense-title">Title</Label>
            <Input
              id="expense-title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Campus lunch"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(event) => updateField("amount", event.target.value)}
                placeholder="18.50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expense-category">Category</Label>
            <Select id="expense-category" value={form.category} onChange={(event) => updateField("category", event.target.value)}>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expense-notes">Notes</Label>
            <Textarea
              id="expense-notes"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Optional details"
            />
          </div>
          <Button type="submit" disabled={!form.title.trim() || Number(form.amount) <= 0}>
            {editing ? "Save changes" : "Add expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
