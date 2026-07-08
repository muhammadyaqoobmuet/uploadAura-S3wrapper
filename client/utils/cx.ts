import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortCx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
