import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath || imagePath.startsWith("http")) {
    return imagePath || "/placeholder.svg";
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, "")
    : "http://localhost:5050";

  if (imagePath.includes("uploads/")) {
    return `${apiBaseUrl}/${imagePath}`;
  }

  const cleanPath = imagePath.replace(/^\/+/, "");

  return `${apiBaseUrl}/${cleanPath}`;
}
