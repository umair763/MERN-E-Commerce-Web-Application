import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely, shadcn/ui-style.
 * Lets every component accept a `className` override without
 * fighting specificity against the base variant classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
