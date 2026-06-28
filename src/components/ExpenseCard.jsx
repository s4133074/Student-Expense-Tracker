import moment from "moment";
import { Edit2, Trash2 } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm">
      <CategoryIcon category={expense.category} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold">{expense.title}</h3>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {moment(expense.date).format("MMM D, YYYY")}
            </p>
          </div>
          <strong className="text-sm">{currency(expense.amount)}</strong>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className="border-transparent bg-muted text-muted-foreground">{expense.category}</Badge>
          {expense.notes ? <span className="truncate text-xs text-muted-foreground">{expense.notes}</span> : null}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.title}`}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(expense.id)}
          aria-label={`Delete ${expense.title}`}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
