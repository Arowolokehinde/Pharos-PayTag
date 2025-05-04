import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return "";

  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

export function calculateTimeLeft(unlockTime: number): string {
  const now = Math.floor(Date.now() / 1000);

  if (now >= unlockTime) {
    return "Unlocked";
  }

  const secondsLeft = unlockTime - now;
  const days = Math.floor(secondsLeft / (24 * 60 * 60));
  const hours = Math.floor((secondsLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
  const seconds = secondsLeft % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
