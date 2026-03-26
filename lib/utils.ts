import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "—"
  try {
    return new Date(dateInput).toLocaleDateString("vi-VN")
  } catch {
    return "—"
  }
}

export function generateRandomHexStr(bytes = 16): string {
  const array = new Uint8Array(bytes)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("")
}

