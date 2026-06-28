import {
  Bus,
  Film,
  GraduationCap,
  HeartPulse,
  Home,
  MoreHorizontal,
  Pizza,
  ShoppingBag,
} from "lucide-react";
import { CATEGORY_STYLES } from "@/data/categories";
import { cn } from "@/lib/utils";

const icons = {
  "Food & Drinks": Pizza,
  Transport: Bus,
  Entertainment: Film,
  Shopping: ShoppingBag,
  Education: GraduationCap,
  Health: HeartPulse,
  "Rent & Bills": Home,
  Other: MoreHorizontal,
};

export default function CategoryIcon({ category, className, iconClassName }) {
  const Icon = icons[category] || MoreHorizontal;
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;

  return (
    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", style.bg, className)}>
      <Icon className={cn("h-5 w-5", style.text, iconClassName)} />
    </span>
  );
}