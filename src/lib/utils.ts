
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const localStorageKeys = {
  THEME: "movie-explorer-theme",
  USER: "movie-explorer-user",
  LAST_SEARCH: "movie-explorer-last-search",
  FAVORITES: "movie-explorer-favorites"
}

export function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
