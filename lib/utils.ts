import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatDateRange(start: Date | string, end: Date | string | null, current: boolean): string {
  const s = new Date(start).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (current) return `${s} — Present`;
  if (!end) return s;
  return `${s} — ${new Date(end).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export function calculateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}
