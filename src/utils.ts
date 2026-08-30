import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IMAGE_MAPPINGS: Record<string, string> = {
  wood: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
  glass:
    "https://images.unsplash.com/photo-1505377059067-e285a7bac49b?auto=format&fit=crop&q=80&w=800",
  wallpaper:
    "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?auto=format&fit=crop&q=80&w=800",
  lighting:
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
  flooring:
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
  metals:
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
  textiles:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  acoustics:
    "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&q=80&w=800",
  abstract:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
};

export function getImageUrl(
  originalUrl: string | null | undefined,
  categoryName?: string,
): string {
  if (!originalUrl || originalUrl.includes("loremflickr.com")) {
    if (categoryName && IMAGE_MAPPINGS[categoryName.toLowerCase()]) {
      return IMAGE_MAPPINGS[categoryName.toLowerCase()];
    }
    if (originalUrl) {
      const lower = originalUrl.toLowerCase();
      for (const [key, value] of Object.entries(IMAGE_MAPPINGS)) {
        if (lower.includes(key)) return value;
      }
    }
    return IMAGE_MAPPINGS.abstract;
  }
  return originalUrl;
}
